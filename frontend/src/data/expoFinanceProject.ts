import { expoFiles } from "./expoAuthoring";
import type { WebProject } from "./webCourseTypes";

export const axiosVersion = "1.21.0";

const rates = `import axios from 'axios';

export type Period = 7 | 30;
export type RatePoint = { date: string; rate: number };

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function parseRates(data: unknown): RatePoint[] {
  if (!Array.isArray(data)) throw new Error('Série de taux attendue.');
  const byDate = new Map<string, RatePoint>();
  for (const item of data) {
    if (!item || typeof item !== 'object') continue;
    const { base, quote, date, rate } = item as Record<string, unknown>;
    if (base === 'EUR' && quote === 'USD' && typeof date === 'string' &&
        /^\\d{4}-\\d{2}-\\d{2}$/.test(date) && typeof rate === 'number' &&
        Number.isFinite(rate) && rate > 0) {
      byDate.set(date, { date, rate });
    }
  }
  const points = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (points.length === 0) throw new Error('Aucun taux valide pour cette période.');
  return points;
}

export async function loadRates(days: Period, signal: AbortSignal) {
  const now = new Date();
  const from = new Date(now.getTime() - (days - 1) * 86_400_000);
  const response = await axios.get<unknown>('https://api.frankfurter.dev/v2/rates', {
    params: { base: 'EUR', quotes: 'USD', from: dateKey(from), to: dateKey(now) },
    signal,
    timeout: 12_000,
  });
  return parseRates(response.data);
}
`;

const preferences = `import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Period } from './rates';

const periodKey = 'devafrica:rates:period';

export async function loadPeriod(): Promise<Period> {
  const value = await AsyncStorage.getItem(periodKey);
  return value === '30' ? 30 : 7;
}

export function savePeriod(period: Period) {
  return AsyncStorage.setItem(periodKey, String(period));
}
`;

const dashboard = `import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { loadPeriod, savePeriod } from './src/preferences';
import { loadRates, type Period, type RatePoint } from './src/rates';
import { colors, ui } from './src/ui';

function shortDate(date: string) {
  return date.slice(8, 10) + '/' + date.slice(5, 7);
}

function Chart({ points }: { points: RatePoint[] }) {
  const step = Math.max(1, Math.ceil(points.length / 7));
  const selected = points.filter((_, index) => index % step === 0 || index === points.length - 1);
  const rates = points.map(({ rate }) => rate);
  const min = Math.min(...rates);
  const span = Math.max(0.001, Math.max(...rates) - min);
  const progress = useSharedValue(0);
  const appearance = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scaleY: Math.max(0.05, progress.value) }],
  }));

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 360, reduceMotion: ReduceMotion.System });
  }, [points, progress]);

  return (
    <View style={ui.panel}>
      <Text style={ui.subtitle}>Variation sur la période</Text>
      <Text style={ui.muted}>Hauteur relative au minimum de la série</Text>
      <Animated.View style={[styles.chart, appearance]}>
        {selected.map((point) => (
          <View key={point.date} style={styles.column}
            accessible accessibilityLabel={point.date + ', ' + point.rate.toFixed(4) + ' dollars'}>
            <View style={[styles.bar, { height: 16 + ((point.rate - min) / span) * 78 }]} />
          </View>
        ))}
      </Animated.View>
      <View style={styles.dates}>
        <Text style={ui.muted}>{shortDate(points[0].date)}</Text>
        <Text style={ui.muted}>{shortDate(points[points.length - 1].date)}</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [period, setPeriod] = useState<Period | null>(null);
  const [revision, setRevision] = useState(0);
  const [points, setPoints] = useState<RatePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [storageMessage, setStorageMessage] = useState('');

  useEffect(() => {
    let active = true;
    loadPeriod()
      .then((value) => { if (active) setPeriod(value); })
      .catch(() => {
        if (active) {
          setPeriod(7);
          setStorageMessage('La préférence locale est indisponible.');
        }
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (period === null) return;
    const controller = new AbortController();
    setLoading(true);
    setPoints([]);
    setMessage('');
    loadRates(period, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setPoints(data); })
      .catch(() => {
        if (!controller.signal.aborted) setMessage('Impossible de charger les taux. Réessaie.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [period, revision]);

  function changePeriod(next: Period) {
    if (period === null || next === period) return;
    setPeriod(next);
    setStorageMessage('');
    void savePeriod(next).catch(() => setStorageMessage('La période n’a pas pu être enregistrée.'));
  }

  const latest = points[points.length - 1];
  return (
    <SafeAreaProvider>
      <SafeAreaView style={ui.screen}>
        <ScrollView contentContainerStyle={ui.content}>
          <Text style={ui.title} accessibilityRole="header">Tableau des taux</Text>
          <Text style={ui.muted}>Historique EUR → USD · Frankfurter</Text>
          <View style={styles.filters}>
            {([7, 30] as const).map((value) => (
              <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: value === period }}
                style={[ui.action, value !== period && styles.inactive]}
                disabled={period === null} onPress={() => changePeriod(value)}>
                <Text style={[ui.actionText, value !== period && styles.inactiveText]}>{value} jours</Text>
              </Pressable>
            ))}
          </View>
          {storageMessage ? <Text style={ui.muted}>{storageMessage}</Text> : null}
          {loading && <ActivityIndicator color={colors.primary} accessibilityLabel="Chargement des taux" />}
          {message ? (
            <View style={ui.panel}>
              <Text style={ui.error}>{message}</Text>
              <Pressable style={ui.action} accessibilityRole="button" onPress={() => setRevision((value) => value + 1)}>
                <Text style={ui.actionText}>Réessayer</Text>
              </Pressable>
            </View>
          ) : null}
          {latest && (
            <>
              <View style={ui.panel}>
                <Text style={ui.subtitle}>Dernière valeur disponible</Text>
                <Text style={styles.latest}>{latest.rate.toFixed(4)} USD</Text>
                <Text style={ui.muted}>Pour 1 EUR · {latest.date}</Text>
              </View>
              <Chart points={points} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  inactive: { backgroundColor: colors.accent },
  inactiveText: { color: colors.primary },
  latest: { color: colors.primary, fontSize: 36, fontWeight: '800' },
  chart: { minHeight: 100, gap: 6, flexDirection: 'row', alignItems: 'flex-end', transformOrigin: 'bottom' },
  column: { flex: 1, alignItems: 'stretch' },
  bar: { backgroundColor: colors.primary, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  dates: { flexDirection: 'row', justifyContent: 'space-between' },
});
`;

export const expoFinanceProject: WebProject = {
  id: "taux-expo-reanimated",
  title: "Le tableau de taux animé",
  description:
    "Charge des taux EUR/USD, anime la série avec Reanimated et retrouve la période choisie après relance.",
  minutes: 145,
  requirements: [
    "Affiche la dernière valeur EUR/USD et un graphique sur 7 ou 30 jours.",
    "Observe l’animation du graphique puis réessaie avec la réduction des mouvements.",
    "Change la période, relance l’application et vérifie qu’elle est conservée.",
    "Coupe Internet, observe le message puis teste le bouton Réessayer.",
  ],
  hints: [
    "La réponse réseau entre dans le programme comme unknown. Vérifie les champs avant de créer RatePoint.",
    "Un AbortController empêche une réponse ancienne d’écraser un choix de période récent.",
    "AsyncStorage conserve la période. Reanimated applique une transition avec ReduceMotion.System.",
  ],
  files: expoFiles("Tableau des taux", {
    id: "taux",
    app: dashboard,
    dependencies: {
      axios: axiosVersion,
      "@react-native-async-storage/async-storage": "2.2.0",
      "react-native-reanimated": "~4.1.1",
      "react-native-worklets": "0.5.1",
    },
    notes:
      "Essaie les deux périodes. L’API Frankfurter publie des valeurs de référence datées et la série peut contenir des jours sans mesure. L’exercice conserve seulement la période d’affichage. Source : https://frankfurter.dev/.",
    extra: { "src/rates.ts": rates, "src/preferences.ts": preferences },
  }),
};
