import { expoFiles } from "./expoAuthoring";
import { axiosVersion } from "./expoFinanceProject";
import { expoShopServer } from "./expoShopServer";
import type { WebProject } from "./webCourseTypes";

const apiSource = `import axios from 'axios';

export type Product = { id: number; name: string; price: number };
export type OrderLine = Product & { quantity: number };
export type Order = { id: string; date: string; total: number; items: OrderLine[] };
export type Session = { email: string; token: string };

export const apiAddress = process.env.EXPO_PUBLIC_API_URL?.trim();
export const api = axios.create({ baseURL: apiAddress, timeout: 10_000 });
export const bearer = (token: string) => ({ Authorization: 'Bearer ' + token });

export function apiMessage(error: unknown, fallback: string) {
  const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
  return typeof message === 'string' ? message : fallback;
}

export function unauthorized(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
`;

const sessionStorage = `import * as SecureStore from 'expo-secure-store';

const tokenKey = 'devafrica.boutique.jwt';

export const readToken = () => SecureStore.getItemAsync(tokenKey);
export const saveToken = (token: string) => SecureStore.setItemAsync(tokenKey, token);
export const forgetToken = () => SecureStore.deleteItemAsync(tokenKey);
`;

const shopStore = `import * as Crypto from 'expo-crypto';
import { create } from 'zustand';
import { api, apiMessage, bearer, type Order, type Product } from './api';

type ShopState = {
  products: Product[];
  quantities: Record<number, number>;
  orders: Order[];
  loading: boolean;
  placing: boolean;
  pendingId: string | null;
  message: string;
  load: (token: string, signal: AbortSignal) => Promise<void>;
  change: (id: number, amount: number) => void;
  place: (token: string) => Promise<void>;
  clear: () => void;
};

const emptyShop = {
  products: [] as Product[],
  quantities: {} as Record<number, number>,
  orders: [] as Order[],
  loading: false,
  placing: false,
  pendingId: null,
  message: '',
};

export const useShop = create<ShopState>((set, get) => ({
  ...emptyShop,

  async load(token, signal) {
    set({ loading: true, message: '' });
    try {
      const [products, orders] = await Promise.all([
        api.get<Product[]>('/products', { signal }),
        api.get<Order[]>('/orders', { headers: bearer(token), signal }),
      ]);
      if (!signal.aborted) set({ products: products.data, orders: orders.data });
    } catch (error) {
      if (!signal.aborted) set({ message: apiMessage(error, 'Impossible de charger la boutique.') });
    } finally {
      if (!signal.aborted) set({ loading: false });
    }
  },

  change(id, amount) {
    const { products, quantities, placing } = get();
    if (placing || !products.some((product) => product.id === id)) return;
    const previous = quantities[id] || 0;
    const next = Math.min(20, Math.max(0, previous + amount));
    if (previous === next) return;
    set({ quantities: { ...quantities, [id]: next }, pendingId: null, message: '' });
  },

  async place(token) {
    const { quantities, pendingId, placing } = get();
    const items = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({ id: Number(id), quantity }));
    if (placing || items.length === 0) return;

    const requestId = pendingId ?? Crypto.randomUUID();
    set({ placing: true, pendingId: requestId, message: '' });
    try {
      const { data: order } = await api.post<Order>(
        '/orders', { items, requestId }, { headers: bearer(token) },
      );
      if (get().pendingId !== requestId) return;
      set((state) => ({
        orders: [order, ...state.orders.filter((item) => item.id !== order.id)],
        quantities: {},
        placing: false,
        pendingId: null,
        message: 'Commande enregistrée. Retrouve-la dans Commandes.',
      }));
    } catch (error) {
      if (get().pendingId !== requestId) return;
      set({ placing: false, message: apiMessage(error, 'Commande indisponible. Réessaie avec le même panier.') });
    }
  },

  clear() {
    set(emptyShop);
  },
}));
`;

const shopApp = `import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { api, apiAddress, apiMessage, bearer, unauthorized, type Session } from './src/api';
import { readToken, saveToken, forgetToken } from './src/session';
import { useShop } from './src/shop';
import { colors, ui } from './src/ui';

function Action({ label, onPress, disabled }: {
  label: string; onPress: () => void; disabled?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: Boolean(disabled) }}
      style={[ui.action, disabled && styles.disabled]} disabled={disabled} onPress={onPress}>
      <Text style={ui.actionText}>{label}</Text>
    </Pressable>
  );
}

function SignIn({ onSession }: { onSession: (value: Session) => void }) {
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function submit() {
    if (loading) return;
    setLoading(true);
    setMessage('');
    try {
      const { data } = await api.post<Session>(register ? '/register' : '/login', {
        email: email.trim(), password,
      });
      await saveToken(data.token);
      setPassword('');
      onSession(data);
    } catch (error) {
      setMessage(apiMessage(error, 'Vérifie que l’API locale est démarrée et que l’appareil y accède.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Text style={ui.title} accessibilityRole="header">{register ? 'Créer un compte' : 'Se connecter'}</Text>
      <Text style={ui.muted}>Utilise un compte fictif pour cet atelier.</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"
        autoComplete="email" style={ui.input} accessibilityLabel="Courriel" placeholder="Courriel" />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none"
        style={ui.input} accessibilityLabel="Mot de passe" placeholder="Mot de passe · 12 caractères" />
      {message ? <Text style={ui.error}>{message}</Text> : null}
      {loading && <ActivityIndicator color={colors.primary} accessibilityLabel="Connexion en cours" />}
      <Action label={register ? 'Créer mon compte' : 'Connexion'} disabled={loading || !email.trim() || password.length < 12}
        onPress={() => void submit()} />
      <Action label={register ? 'J’ai déjà un compte' : 'Créer un compte'} disabled={loading}
        onPress={() => { setRegister(!register); setMessage(''); }} />
    </>
  );
}

const tabs = ['Catalogue', 'Panier', 'Commandes'] as const;
type Tab = typeof tabs[number];

function Store({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('Catalogue');
  const [retry, setRetry] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  const activeLoad = useRef<AbortController | null>(null);
  const { products, quantities, orders, loading, placing, message, change, place, load, clear } = useShop();
  const basket = products.filter((item) => (quantities[item.id] || 0) > 0);
  const count = basket.reduce((sum, item) => sum + quantities[item.id], 0);
  const total = basket.reduce((sum, item) => sum + quantities[item.id] * item.price, 0);

  useEffect(() => {
    const controller = new AbortController();
    activeLoad.current = controller;
    void load(session.token, controller.signal);
    return () => controller.abort();
  }, [load, retry, session.token]);

  async function logout() {
    if (loggingOut || placing) return;
    setLoggingOut(true);
    try {
      await forgetToken();
    } catch (_) {
      setLogoutMessage('Le stockage sécurisé est indisponible. Réessaie de te déconnecter.');
      setLoggingOut(false);
      return;
    }
    void api.delete('/session', { headers: bearer(session.token) }).catch(() => undefined);
    activeLoad.current?.abort();
    clear();
    onLogout();
  }

  return (
    <>
      <Text style={ui.title} accessibilityRole="header">Boutique DevAfrica</Text>
      <Text style={ui.muted}>{session.email} · {count} article(s) au panier</Text>
      <View style={styles.tabs}>
        {tabs.map((name) => (
          <Pressable key={name} accessibilityRole="tab" accessibilityState={{ selected: tab === name }}
            style={[ui.action, tab !== name && styles.inactive]} onPress={() => setTab(name)}>
            <Text style={[ui.actionText, tab !== name && styles.inactiveText]}>{name}</Text>
          </Pressable>
        ))}
      </View>
      {loading && <ActivityIndicator color={colors.primary} accessibilityLabel="Chargement de la boutique" />}
      {message ? <Text style={ui.muted} accessibilityLiveRegion="polite">{message}</Text> : null}
      {tab === 'Catalogue' && products.map((item) => (
        <View key={item.id} style={ui.panel}>
          <Text style={ui.subtitle}>{item.name}</Text>
          <Text style={ui.muted}>{item.price} Ar</Text>
          <Action label={'Ajouter ' + item.name} disabled={placing || (quantities[item.id] || 0) >= 20}
            onPress={() => change(item.id, 1)} />
        </View>
      ))}
      {tab === 'Panier' && (
        <>
          {basket.length === 0 && <Text style={ui.muted}>Ton panier est vide.</Text>}
          {basket.map((item) => (
            <View key={item.id} style={ui.panel}>
              <Text style={ui.subtitle}>{item.name} · {quantities[item.id]}</Text>
              <Action label={'Retirer une unité de ' + item.name} disabled={placing} onPress={() => change(item.id, -1)} />
            </View>
          ))}
          <Text style={ui.subtitle}>Total estimé · {total} Ar</Text>
          <Action label={placing ? 'Enregistrement…' : 'Passer la commande'} disabled={!count || placing}
            onPress={() => void place(session.token)} />
        </>
      )}
      {tab === 'Commandes' && (
        <>
          {!orders.length && <Text style={ui.muted}>Aucune commande enregistrée.</Text>}
          {orders.map((order) => (
            <View key={order.id} style={ui.panel}>
              <Text style={ui.subtitle}>{order.total} Ar · {order.date.slice(0, 10)}</Text>
              {order.items.map((item) => (
                <Text key={item.id} style={ui.muted}>{item.name} × {item.quantity}</Text>
              ))}
            </View>
          ))}
        </>
      )}
      {message && !loading && tab === 'Catalogue' && products.length === 0 && (
        <Action label="Recharger le catalogue" onPress={() => setRetry((value) => value + 1)} />
      )}
      {logoutMessage ? <Text style={ui.error}>{logoutMessage}</Text> : null}
      <Action label="Se déconnecter" disabled={loggingOut || placing} onPress={() => void logout()} />
    </>
  );
}

function NativeShop() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(Boolean(apiAddress));
  const [message, setMessage] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!apiAddress) return;
    const controller = new AbortController();
    setChecking(true);
    setMessage('');
    async function restore() {
      try {
        const token = await readToken();
        if (!token || controller.signal.aborted) return;
        const { data } = await api.get<{ email: string }>('/session', {
          headers: bearer(token), signal: controller.signal,
        });
        if (!controller.signal.aborted) setSession({ email: data.email, token });
      } catch (error) {
        if (controller.signal.aborted) return;
        if (unauthorized(error)) {
          try {
            await forgetToken();
          } catch (_) {
            if (!controller.signal.aborted) setMessage('Impossible de nettoyer la session enregistrée.');
          }
        } else {
          setMessage('Impossible de vérifier la session. Vérifie l’adresse et démarre l’API.');
        }
      } finally {
        if (!controller.signal.aborted) setChecking(false);
      }
    }
    void restore();
    return () => controller.abort();
  }, [retry]);

  if (!apiAddress) {
    return <Text style={ui.error}>Configure EXPO_PUBLIC_API_URL selon le README de l’atelier.</Text>;
  }
  if (checking) return <ActivityIndicator color={colors.primary} accessibilityLabel="Vérification de la session" />;
  if (message) {
    return (
      <>
        <Text style={ui.error}>{message}</Text>
        <Action label="Réessayer" onPress={() => setRetry((value) => value + 1)} />
      </>
    );
  }
  return session ? <Store session={session} onLogout={() => setSession(null)} /> : <SignIn onSession={setSession} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={ui.screen}>
        <ScrollView contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled">
          {Platform.OS === 'web'
            ? <Text style={ui.muted}>Ouvre cet atelier dans Expo Go sur Android ou iOS pour essayer SecureStore.</Text>
            : <NativeShop />}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  disabled: { opacity: 0.52 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  inactive: { backgroundColor: colors.accent },
  inactiveText: { color: colors.primary },
});
`;

export const expoShopProject: WebProject = {
  id: "boutique-expo-zustand",
  title: "La boutique avec compte et commandes",
  description:
    "Relie l’app à une API Express, protège la session et partage panier et commandes avec Zustand.",
  minutes: 165,
  requirements: [
    "Inscris un compte fictif, connecte-toi et retrouve la session après relance.",
    "Ajoute deux produits au panier et enregistre une commande.",
    "Déconnecte-toi puis vérifie qu’un autre compte voit son propre historique.",
    "Teste une coupure pendant la commande et renvoie le même panier pour éviter un doublon.",
  ],
  hints: [
    "SecureStore conserve le jeton. Le serveur vérifie la signature et l’état de la session.",
    "Le store Zustand gère les quantités et l’historique. L’API calcule le total de la commande.",
    "L’identifiant de requête est conservé après une erreur. Le serveur retourne la commande existante lors d’un nouvel essai identique.",
  ],
  files: expoFiles("Boutique DevAfrica", {
    id: "boutique",
    app: shopApp,
    dependencies: {
      axios: axiosVersion,
      "expo-secure-store": "~15.0.8",
      "expo-crypto": "~15.0.9",
      zustand: "5.1.0",
      express: "5.3.0",
      "express-rate-limit": "8.7.3",
      jsonwebtoken: "9.0.3",
    },
    scripts: { api: "node server/index.cjs" },
    notes: `## Démarrer l’API locale

1. Après npm install, ouvre un premier terminal et lance npm run api.
2. Duplique .env.example en .env.local. Avec l’émulateur Android standard, garde EXPO_PUBLIC_API_URL=http://10.0.2.2:3000. Avec le simulateur iOS du Mac, utilise http://127.0.0.1:3000.
3. Pour un téléphone physique, utilise l’adresse IPv4 de ton ordinateur sur le même réseau et démarre le serveur avec HOST=0.0.0.0. Sous PowerShell, saisis $env:HOST = '0.0.0.0' puis npm run api.
4. Dans un second terminal, lance npm start ou redémarre Expo après modification de .env.local. Ouvre l’atelier dans Expo Go.

La route /health permet de vérifier l’adresse de l’API. Le serveur utilise SQLite intégré à Node.js 24.
Utilise un compte fictif, par exemple atelier@example.org et un mot de passe d’au moins 12 caractères.
Les commandes sont enregistrées en ariary pour la démonstration, sans paiement.
Le fichier serveur de la clé JWT et la base SQLite sont créés dans server/data.
La variable EXPO_PUBLIC_API_URL contient uniquement l’adresse du serveur.
Le test HTTP est prévu sur ton ordinateur ou ton réseau local. Pour une mise en ligne, utilise HTTPS et une clé de signature gérée côté serveur.`,
    extra: {
      ".env.example": "EXPO_PUBLIC_API_URL=http://10.0.2.2:3000\n",
      "server/index.cjs": expoShopServer,
      "src/api.ts": apiSource,
      "src/session.ts": sessionStorage,
      "src/shop.ts": shopStore,
    },
  }),
};
