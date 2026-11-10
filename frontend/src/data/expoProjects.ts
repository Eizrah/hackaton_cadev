import { expoFiles, nativeNavigation } from "./expoAuthoring";
import type { WebProject } from "./webCourseTypes";

const profileApp = `import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors, ui } from './src/ui';

export default function App() {
  const [showContact, setShowContact] = useState(false);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={ui.screen}>
        <ScrollView contentContainerStyle={styles.center}>
          <View style={[ui.panel, styles.profile]}>
            <Image source={require('./assets/avatar.png')} style={styles.avatar}
              accessible accessibilityLabel="Portrait illustré de Soa" />
            <Text style={ui.title} accessibilityRole="header">Soa Rakoto</Text>
            <Text style={styles.role}>Développement mobile</Text>
            <Text style={ui.muted}>Toamasina · Madagascar</Text>
            <Pressable
              style={({ pressed }) => [ui.action, pressed && { opacity: 0.78 }]}
              accessibilityRole="button" accessibilityState={{ expanded: showContact }}
              onPress={() => setShowContact((shown) => !shown)}
            >
              <Text style={ui.actionText}>{showContact ? 'Masquer le contact' : 'Afficher le contact'}</Text>
            </Pressable>
            {showContact && <Text style={ui.muted}>soa@example.org</Text>}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  profile: { width: '100%', maxWidth: 440, alignItems: 'center', padding: 24 },
  avatar: { width: 112, height: 112, borderRadius: 56, marginBottom: 8, backgroundColor: colors.accent },
  role: { color: colors.primary, fontWeight: '700', fontSize: 17 },
});
`;

const voteApp = `import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors, ui } from './src/ui';

export default function App() {
  const [question, setQuestion] = useState('Quel atelier veux-tu essayer ?');
  const [designVotes, setDesignVotes] = useState(0);
  const [codeVotes, setCodeVotes] = useState(0);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={ui.screen}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={ui.content}>
          <Text style={ui.title} accessibilityRole="header">Le vote de l’atelier</Text>
          <TextInput accessibilityLabel="Modifier la question" value={question}
            onChangeText={setQuestion} maxLength={80} placeholder="Question du vote" style={ui.input} />
          <Text style={ui.subtitle}>{question.trim() || 'Choisis une option.'}</Text>
          <View style={styles.options}>
            <Vote name="Design" votes={designVotes} onVote={() => setDesignVotes((count) => count + 1)} />
            <Vote name="Code" votes={codeVotes} onVote={() => setCodeVotes((count) => count + 1)} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

type VoteProps = { name: string; votes: number; onVote: () => void };

function Vote({ name, votes, onVote }: VoteProps) {
  return (
    <View style={[ui.panel, styles.option]}>
      <Text style={ui.subtitle}>{name}</Text>
      <Text style={styles.score} accessibilityLiveRegion="polite">{votes}</Text>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={'Voter ' + name}
        style={ui.action} onPress={onVote}>
        <Text style={ui.actionText}>Voter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  option: { flexGrow: 1, flexBasis: 125 },
  score: { color: colors.primary, fontSize: 36, fontWeight: '800' },
});
`;

export const expoBeginnerProjects: WebProject[] = [
  {
    id: "carte-profil-expo",
    title: "La carte de profil native",
    description:
      "Compose un profil centré avec une photo locale, du texte et un bouton Pressable.",
    minutes: 75,
    requirements: [
      "Affiche une image locale ronde et le nom de ton profil.",
      "Centre la carte sur les deux axes et vérifie l’affichage sur un petit écran.",
      "Affiche puis masque le contact à l’aide du bouton.",
    ],
    hints: [
      "La carte utilise View, Text et Image. StyleSheet regroupe leurs règles.",
      "flexGrow permet au contenu du ScrollView d’occuper la hauteur disponible.",
      "Pressable donne accès à l’état pressed pour varier l’opacité.",
    ],
    files: expoFiles("Carte de profil", {
      id: "profil",
      app: profileApp,
      notes:
        "Personnalise le nom et le domaine. Le portrait local est une illustration. Lance npm run web pour essayer aussi la carte dans un navigateur.",
      assets: { "assets/avatar.png": "learning/mobile/avatar.png" },
    }),
  },
  {
    id: "vote-expo",
    title: "Le vote interactif",
    description:
      "Relie deux actions à deux compteurs et adapte la question depuis un champ de saisie.",
    minutes: 75,
    requirements: [
      "Affiche deux choix et deux compteurs initialisés à zéro.",
      "Vérifie que deux votes Design et un vote Code donnent 2 et 1.",
      "Modifie la question depuis TextInput et observe le texte affiché.",
    ],
    hints: [
      "onChangeText reçoit directement le texte saisi.",
      "La forme setVotes(previous => previous + 1) part de la valeur la plus récente.",
      "accessibilityLabel distingue deux boutons qui affichent tous les deux Voter.",
    ],
    files: expoFiles("Vote interactif", {
      id: "vote",
      app: voteApp,
      notes:
        "Les votes restent dans l’état de cet écran pendant la session. Essaie un titre long et une taille de texte élevée.",
    }),
  },
];

const gifts = `export type Gift = { id: string; name: string; description: string };

export const gifts: Gift[] = [
  { id: 'carnet', name: 'Carnet de croquis', description: 'Pour les maquettes et idées rapides.' },
  { id: 'gourde', name: 'Gourde', description: 'À emporter pendant les ateliers.' },
  { id: 'lampe', name: 'Lampe de bureau', description: 'Pour éclairer son espace de travail.' },
  { id: 'sac', name: 'Sac en toile', description: 'Pour transporter son matériel.' },
];
`;

const wishlistContext = `import { createContext, useContext, useState, type ReactNode } from 'react';

type Wishlist = { savedIds: string[]; toggle: (id: string) => void };

const WishlistContext = createContext<Wishlist | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  function toggle(id: string) {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <WishlistContext.Provider value={{ savedIds, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const wishlist = useContext(WishlistContext);
  if (!wishlist) throw new Error('WishlistProvider doit entourer cet écran.');
  return wishlist;
}
`;

const wishlistApp = `import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { gifts, type Gift } from './src/gifts';
import { WishlistProvider, useWishlist } from './src/wishlist';
import { ui } from './src/ui';

const Tabs = createBottomTabNavigator();

function GiftRow({ gift }: { gift: Gift }) {
  const { savedIds, toggle } = useWishlist();
  const saved = savedIds.includes(gift.id);
  return (
    <View style={ui.panel}>
      <Text style={ui.subtitle}>{gift.name}</Text>
      <Text style={ui.muted}>{gift.description}</Text>
      <Pressable style={ui.action} accessibilityRole="button" accessibilityState={{ selected: saved }}
        accessibilityLabel={(saved ? 'Retirer ' : 'Ajouter ') + gift.name}
        onPress={() => toggle(gift.id)}>
        <Text style={ui.actionText}>{saved ? 'Retirer' : 'Ajouter aux envies'}</Text>
      </Pressable>
    </View>
  );
}

function GiftList({ items }: { items: Gift[] }) {
  return (
    <FlatList style={ui.screen} contentContainerStyle={ui.content} data={items}
      keyExtractor={(gift) => gift.id} renderItem={({ item }) => <GiftRow gift={item} />}
      ListEmptyComponent={<Text style={ui.muted}>Ta liste d’envies est vide.</Text>} />
  );
}

function CatalogScreen() {
  return <GiftList items={gifts} />;
}

function WishlistScreen() {
  const { savedIds } = useWishlist();
  return <GiftList items={gifts.filter((gift) => savedIds.includes(gift.id))} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <WishlistProvider>
        <NavigationContainer>
          <Tabs.Navigator screenOptions={{ tabBarHideOnKeyboard: true }}>
            <Tabs.Screen name="Catalogue" component={CatalogScreen} />
            <Tabs.Screen name="Mes envies" component={WishlistScreen} />
          </Tabs.Navigator>
        </NavigationContainer>
      </WishlistProvider>
    </SafeAreaProvider>
  );
}
`;

const news = `export type Article = { id: string; title: string; summary: string; paragraphs: string[] };

export const articles: Article[] = [
  {
    id: 'mobile',
    title: 'Un atelier mobile à Toamasina',
    summary: 'Des étudiants partagent leurs premiers prototypes.',
    paragraphs: [
      'Un groupe d’étudiants se retrouve pour tester des prototypes sur plusieurs tailles d’écran. Les équipes commencent avec un scénario de deux minutes et prennent des notes.',
      'Le prochain atelier portera sur la lisibilité et les retours visuels. Chaque participant apportera un exemple d’interaction à améliorer.',
    ],
  },
  {
    id: 'donnees',
    title: 'Cartographier des données ouvertes',
    summary: 'Une rencontre autour des données publiques et de la carte.',
    paragraphs: [
      'Les participants explorent un jeu de points d’intérêt et comparent plusieurs manières de les afficher. Ils notent les informations à vérifier avant publication.',
      'La discussion se termine avec une liste de corrections à préparer et des idées de filtres pour la prochaine version.',
    ],
  },
  {
    id: 'design',
    title: 'Une revue d’interfaces accessible',
    summary: 'Focus sur le texte, les contrastes et les commandes.',
    paragraphs: [
      'L’équipe teste des écrans avec de grandes tailles de texte et observe ce qui se passe lorsque les boutons passent à la ligne.',
      'Les résultats serviront à choisir des titres plus clairs et à distinguer les actions importantes.',
    ],
  },
];
`;

const newsApp = `import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { articles } from './src/articles';
import { ui } from './src/ui';

type Routes = { Actualites: undefined; Article: { articleId: string } };
const Stack = createNativeStackNavigator<Routes>();

function Feed({ navigation }: NativeStackScreenProps<Routes, 'Actualites'>) {
  return (
    <FlatList style={ui.screen} contentContainerStyle={ui.content}
      data={articles} keyExtractor={(article) => article.id}
      renderItem={({ item }) => (
        <Pressable style={ui.panel} accessibilityRole="button"
          onPress={() => navigation.navigate('Article', { articleId: item.id })}>
          <Text style={ui.subtitle}>{item.title}</Text>
          <Text style={ui.muted}>{item.summary}</Text>
        </Pressable>
      )} />
  );
}

function Reader({ route }: NativeStackScreenProps<Routes, 'Article'>) {
  const article = articles.find((item) => item.id === route.params.articleId);
  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.content}>
      {article ? (
        <>
          <Text style={ui.title} accessibilityRole="header">{article.title}</Text>
          {article.paragraphs.map((paragraph) => (
            <Text key={paragraph} style={ui.muted}>{paragraph}</Text>
          ))}
        </>
      ) : <Text style={ui.error}>Article introuvable.</Text>}
    </ScrollView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Actualites" component={Feed} options={{ title: 'Actualités' }} />
          <Stack.Screen name="Article" component={Reader} options={{ title: 'Lire un article' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
`;

export const expoIntermediateProjects: WebProject[] = [
  {
    id: "envies-expo-context",
    title: "La liste d’envies",
    description:
      "Utilise deux onglets et un contexte partagé pour enregistrer les cadeaux qui t’intéressent.",
    minutes: 100,
    requirements: [
      "Affiche un catalogue dans une FlatList et ajoute un cadeau aux envies.",
      "Ouvre l’onglet Mes envies et vérifie qu’il lit la même sélection.",
      "Retire un cadeau et retrouve l’état mis à jour dans le catalogue.",
    ],
    hints: [
      "Le provider doit entourer les deux onglets.",
      "Une liste d’identifiants évite de recopier les données du catalogue.",
      "keyExtractor donne à FlatList l’identité de chaque ligne.",
    ],
    files: expoFiles("Liste d’envies", {
      id: "envies",
      app: wishlistApp,
      dependencies: {
        ...nativeNavigation,
        "@react-navigation/bottom-tabs": "7.4.6",
      },
      notes:
        "Ajoute deux cadeaux, change d’onglet puis retire-en un. La sélection reste en mémoire tant que l’application tourne.",
      extra: { "src/gifts.ts": gifts, "src/wishlist.tsx": wishlistContext },
    }),
  },
  {
    id: "actualites-expo-stack",
    title: "Le fil d’actualités",
    description:
      "Ouvre un article depuis une liste et reviens au fil grâce à la pile de navigation.",
    minutes: 90,
    requirements: [
      "Affiche les titres et résumés avec FlatList.",
      "Transmets articleId à l’écran de lecture et affiche le bon texte.",
      "Ouvre deux articles successivement en utilisant le bouton Retour.",
    ],
    hints: [
      "Le type Routes documente les paramètres de chaque écran.",
      "La vue de lecture recherche l’article par identifiant.",
      "Le navigateur natif gère la transition et le retour.",
    ],
    files: expoFiles("Le fil d’actualités", {
      id: "actualites",
      app: newsApp,
      dependencies: {
        ...nativeNavigation,
        "@react-navigation/native-stack": "7.3.26",
      },
      notes:
        "Les trois articles sont des exemples rédigés pour l’exercice. Ajoute un article dans src/articles.ts puis vérifie sa route.",
      extra: { "src/articles.ts": news },
    }),
  },
];
