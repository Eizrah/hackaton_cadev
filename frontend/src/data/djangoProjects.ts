import { djangoFiles, djangoPage } from "./djangoAuthoring";
import type { WebProject } from "./webCourseTypes";

const signup = `
def signup(request):
    form = UserCreationForm(request.POST if request.method == "POST" else None)
    if request.method == "POST" and form.is_valid():
        login(request, form.save())
        return redirect("home")
    return render(request, "signup.html", {"form": form})
`;

const signupPage = djangoPage(
  "Créer un compte",
  `<h1>Créer un compte</h1>
<form class="card" method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button>Créer mon compte</button>
</form>`,
);

const blog: WebProject = {
  id: "blog-personnel",
  title: "Le blog personnel",
  description:
    "Construis un blog à partir d’une liste Python. L’accueil présente les articles et chaque titre ouvre sa propre page.",
  minutes: 45,
  requirements: [
    "Afficher une liste d’articles définis dans le code.",
    "Ouvrir un article par son slug et renvoyer un statut 404 pour un slug inconnu.",
    "Partager le menu et les styles avec l’héritage de templates.",
  ],
  hints: [
    "Associe articles/<slug:slug>/ à la vue detail.",
    "Garde une structure commune dans base.html.",
    "Teste /articles/inconnu/ et observe la réponse.",
  ],
  files: djangoFiles("Le blog personnel", {
    views: `from django.http import Http404
from django.shortcuts import render

ARTICLES = [
    {"slug": "premiere-page", "title": "Ma première page", "body": "Aujourd’hui, je relie un chemin à une vue Django."},
    {"slug": "mes-outils", "title": "Mes outils de travail", "body": "Je lis les messages du terminal et j’inspecte mes pages dans le navigateur."},
]


def home(request):
    return render(request, "home.html", {"articles": ARTICLES})


def detail(request, slug):
    article = next((item for item in ARTICLES if item["slug"] == slug), None)
    if article is None:
        raise Http404("Article introuvable")
    return render(request, "article.html", {"article": article})
`,
    urls: `from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("articles/<slug:slug>/", views.detail, name="article"),
]
`,
    home: djangoPage(
      "Mon blog",
      `<h1>Mon blog de développeur</h1>
<p>Je note ici les étapes de mon apprentissage.</p>
{% for article in articles %}
  <article class="card">
    <h2><a href="{% url 'article' article.slug %}">{{ article.title }}</a></h2>
    <p>{{ article.body|truncatewords:12 }}</p>
  </article>
{% empty %}
  <p>Aucun article pour le moment.</p>
{% endfor %}`,
    ),
    sources: {
      "templates/article.html": djangoPage(
        "{{ article.title }}",
        `<a href="{% url 'home' %}">← Tous les articles</a>
<article class="card">
  <h1>{{ article.title }}</h1>
  <p>{{ article.body }}</p>
</article>`,
      ),
    },
  }),
};

const quotes: WebProject = {
  id: "generateur-citations",
  title: "Le générateur de citations",
  description:
    "Fais choisir au serveur une citation issue d’un petit dictionnaire Python et affiche-la dans une page soignée.",
  minutes: 40,
  requirements: [
    "Choisir une citation depuis un dictionnaire Python.",
    "Transmettre le texte et la source au template.",
    "Relancer le tirage depuis un bouton et conserver la mise en page sur mobile.",
  ],
  hints: [
    "choice(list(CITATIONS.items())) renvoie une paire.",
    "La vue répond à une requête GET. Un nouveau tirage peut donner la même citation.",
  ],
  files: djangoFiles("Une citation pour apprendre", {
    views: `from random import choice

from django.shortcuts import render

CITATIONS = {
    "Un petit exercice vaut mieux qu’une longue attente.": "Carnet DevAfrica",
    "Décris le problème avant de changer le code.": "Notes d’atelier",
    "Partage ce que tu viens de comprendre.": "Équipe DevAfrica",
}


def home(request):
    text, source = choice(list(CITATIONS.items()))
    return render(request, "home.html", {"text": text, "source": source})
`,
    home: djangoPage(
      "Générateur de citations",
      `<h1>Une citation pour apprendre</h1>
<figure class="card">
  <blockquote>{{ text }}</blockquote>
  <figcaption>— {{ source }}</figcaption>
</figure>
<form action="{% url 'home' %}" method="get">
  <button>Tirer une citation</button>
</form>`,
    ),
  }),
};

const todo: WebProject = {
  id: "liste-taches-django",
  title: "La liste de tâches avec SQLite",
  description:
    "Construis un CRUD de tâches. L’état de chaque tâche reste en base après un rafraîchissement.",
  minutes: 65,
  requirements: [
    "Créer les migrations et stocker chaque tâche dans SQLite.",
    "Ajouter une tâche par un ModelForm et la marquer comme terminée.",
    "Supprimer une tâche par une requête POST et vérifier la persistance après rafraîchissement.",
  ],
  hints: [
    "Teste un titre vide. Le formulaire doit afficher une erreur.",
    "Django Admin permet de relire les tâches. Le README explique comment créer le compte.",
    "Sur cette démo locale, la liste est commune. Essaie d’ajouter un propriétaire et de filtrer par utilisateur.",
  ],
  files: djangoFiles("Liste de tâches", {
    views: `from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

from .forms import TaskForm
from .models import Task


def home(request):
    form = TaskForm(request.POST if request.method == "POST" else None)
    if request.method == "POST" and form.is_valid():
        form.save()
        return redirect("home")
    return render(request, "home.html", {"form": form, "tasks": Task.objects.order_by("done", "-id")})


@require_POST
def toggle(request, pk):
    task = get_object_or_404(Task, pk=pk)
    task.done = not task.done
    task.save(update_fields=["done"])
    return redirect("home")


@require_POST
def delete(request, pk):
    get_object_or_404(Task, pk=pk).delete()
    return redirect("home")
`,
    urls: `from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("taches/<int:pk>/etat/", views.toggle, name="toggle"),
    path("taches/<int:pk>/supprimer/", views.delete, name="delete"),
]
`,
    home: djangoPage(
      "Liste de tâches",
      `<h1>Mes tâches de l’atelier</h1>
<form class="card" method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button>Ajouter une tâche</button>
</form>
{% for task in tasks %}
  <article class="card">
    <h2 {% if task.done %}class="done"{% endif %}>{{ task.title }}</h2>
    <div class="actions">
      <form method="post" action="{% url 'toggle' task.pk %}">
        {% csrf_token %}
        <button>{% if task.done %}Rouvrir{% else %}Terminer{% endif %}</button>
      </form>
      <form method="post" action="{% url 'delete' task.pk %}">
        {% csrf_token %}
        <button>Supprimer</button>
      </form>
    </div>
  </article>
{% empty %}
  <p>Ajoute ta première tâche.</p>
{% endfor %}`,
    ),
    sources: {
      "atelier/models.py": `from django.db import models


class Task(models.Model):
    title = models.CharField("titre", max_length=120)
    done = models.BooleanField("terminée", default=False)
    created_at = models.DateTimeField("créée le", auto_now_add=True)

    def __str__(self):
        return self.title
`,
      "atelier/forms.py": `from django import forms

from .models import Task


class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ["title"]
`,
      "atelier/admin.py": `from django.contrib import admin

from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "done", "created_at")
    list_filter = ("done",)
    search_fields = ("title",)
`,
    },
  }),
};

const ads: WebProject = {
  id: "petites-annonces",
  title: "Le site de petites annonces",
  description:
    "Affiche les annonces stockées en base et laisse les membres connectés proposer leurs propres annonces.",
  minutes: 70,
  requirements: [
    "Afficher la liste des annonces aux visiteurs.",
    "Créer un compte et se connecter pour soumettre une annonce.",
    "Valider le titre, la description et le prix côté serveur et afficher la nouvelle annonce.",
  ],
  hints: [
    "ModelForm expose les champs éditables. La vue attribue le propriétaire à partir de request.user.",
    "Vérifie la redirection vers la connexion quand tu visites /annonces/ajouter/ déconnecté.",
    "Teste une annonce à prix négatif, puis une annonce valide.",
  ],
  files: djangoFiles("Petites annonces", {
    views: `from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect, render

from .forms import ListingForm
from .models import Listing


def home(request):
    listings = Listing.objects.select_related("owner").order_by("-id")
    return render(request, "home.html", {"listings": listings})

${signup}
@login_required
def create_listing(request):
    form = ListingForm(request.POST if request.method == "POST" else None)
    if request.method == "POST" and form.is_valid():
        listing = form.save(commit=False)
        listing.owner = request.user
        listing.save()
        return redirect("home")
    return render(request, "listing_form.html", {"form": form})
`,
    urls: `from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("inscription/", views.signup, name="signup"),
    path("annonces/ajouter/", views.create_listing, name="create-listing"),
]
`,
    home: djangoPage(
      "Petites annonces",
      `<h1>Le marché de DevAfrica</h1>
<div class="actions">
  <a href="{% url 'create-listing' %}">Déposer une annonce</a>
  {% if not user.is_authenticated %}<a href="{% url 'signup' %}">Créer un compte</a>{% endif %}
</div>
{% for listing in listings %}
  <article class="card">
    <h2>{{ listing.title }}</h2>
    <p>{{ listing.description }}</p>
    <strong>{{ listing.price }} €</strong>
    <p>Par {{ listing.owner.get_username }}</p>
  </article>
{% empty %}
  <p>Aucune annonce publiée.</p>
{% endfor %}`,
    ),
    sources: {
      "atelier/models.py": `from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Listing(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField("titre", max_length=120)
    description = models.TextField("description", max_length=1500)
    price = models.DecimalField("prix", max_digits=9, decimal_places=2, validators=[MinValueValidator(Decimal("0"))])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
`,
      "atelier/forms.py": `from django import forms

from .models import Listing


class ListingForm(forms.ModelForm):
    class Meta:
        model = Listing
        fields = ["title", "description", "price"]
`,
      "atelier/admin.py": `from django.contrib import admin
from .models import Listing

admin.site.register(Listing)
`,
      "templates/signup.html": signupPage,
      "templates/listing_form.html": djangoPage(
        "Nouvelle annonce",
        `<h1>Déposer une annonce</h1>
<form class="card" method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button>Publier</button>
</form>`,
      ),
    },
  }),
};

const shop: WebProject = {
  id: "api-commerce",
  title: "L’API REST de la boutique",
  description:
    "Expose le catalogue au public et réserve le panier et les commandes au compte connecté.",
  minutes: 100,
  requirements: [
    "Relier un produit à sa catégorie et le sérialiser dans un catalogue public.",
    "Créer un panier privé et valider les quantités avec DRF.",
    "Créer une commande en vidant uniquement le panier du compte connecté. Tester avec deux comptes.",
  ],
  hints: [
    "Crée un compte avec createsuperuser et ajoute une catégorie et un produit dans /admin/.",
    "Les URLs de l’accueil ouvrent l’API navigable. Connecte-toi avant de créer une ligne de panier.",
    "POST /api/commander/ finalise le panier. GET /api/commandes/ montre son historique.",
  ],
  files: djangoFiles("API de la boutique", {
    rest: true,
    entry: "atelier/api.py",
    urls: `from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import api, views

router = DefaultRouter()
router.register("categories", api.CategoryViewSet)
router.register("produits", api.ProductViewSet)
router.register("panier", api.CartViewSet, basename="cart")
router.register("commandes", api.OrderViewSet, basename="order")
urlpatterns = [
    path("", views.home, name="home"),
    path("api/commander/", api.checkout, name="checkout"),
    path("api/", include(router.urls)),
]
`,
    home: djangoPage(
      "API de la boutique",
      `<h1>API de la boutique</h1>
<section class="card">
  <h2>Catalogue public</h2>
  <div class="actions"><a href="/api/produits/">Produits</a><a href="/api/categories/">Catégories</a></div>
</section>
<section class="card">
  <h2>Espace client</h2>
  <div class="actions">
    <a href="/api/panier/">Panier</a>
    <a href="/api/commandes/">Commandes</a>
  </div>
  {% if user.is_authenticated %}
    <form method="post" action="{% url 'checkout' %}">
      {% csrf_token %}
      <button>Passer la commande</button>
    </form>
  {% endif %}
</section>
<a href="/admin/">Gérer les produits dans l’administration</a>`,
    ),
    sources: {
      "atelier/models.py": `from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Category(models.Model):
    name = models.CharField("nom", max_length=100, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    name = models.CharField("nom", max_length=120)
    price = models.DecimalField("prix", max_digits=9, decimal_places=2, validators=[MinValueValidator(Decimal("0"))])

    def __str__(self):
        return self.name


class CartLine(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveSmallIntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["owner", "product"], name="unique_cart_product"),
            models.CheckConstraint(condition=models.Q(quantity__gte=1, quantity__lte=99), name="valid_cart_quantity"),
        ]


class Order(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=20, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    name = models.CharField(max_length=120)
    quantity = models.PositiveSmallIntegerField()
    unit_price = models.DecimalField(max_digits=9, decimal_places=2)
`,
      "atelier/serializers.py": `from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from .models import CartLine, Category, Order, OrderItem, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "price", "category"]


class CartSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    quantity = serializers.IntegerField(min_value=1, max_value=99)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = CartLine
        fields = ["id", "owner", "product", "product_name", "quantity"]
        validators = [
            UniqueTogetherValidator(queryset=CartLine.objects.all(), fields=["owner", "product"]),
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["name", "quantity", "unit_price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "total", "created_at", "items"]
`,
      "atelier/api.py": `from decimal import Decimal

from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import CartLine, Category, Order, OrderItem, Product
from .serializers import (
    CartSerializer, CategorySerializer, OrderSerializer, ProductSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.select_related("category").order_by("name")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartLine.objects.filter(owner=self.request.user).select_related("product")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(owner=self.request.user).prefetch_related("items").order_by("-id")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def checkout(request):
    lines = list(CartLine.objects.select_for_update().filter(owner=request.user).select_related("product"))
    if not lines:
        return Response({"detail": "Le panier est vide."}, status=status.HTTP_400_BAD_REQUEST)
    total = sum((line.product.price * line.quantity for line in lines), Decimal("0"))
    order = Order.objects.create(owner=request.user, total=total)
    OrderItem.objects.bulk_create([
        OrderItem(order=order, name=line.product.name, quantity=line.quantity, unit_price=line.product.price)
        for line in lines
    ])
    CartLine.objects.filter(owner=request.user, pk__in=[line.pk for line in lines]).delete()
    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
`,
      "atelier/admin.py": `from django.contrib import admin
from .models import Category, Product

admin.site.register(Category)
admin.site.register(Product)
`,
    },
    notes:
      "Dans /admin/, ajoute une catégorie puis un produit. Connecte-toi pour créer une ligne dans /api/panier/. Le bouton de l’accueil passe la commande. /api/commandes/ affiche le résultat.",
  }),
};

const social: WebProject = {
  id: "reseau-social-prive",
  title: "Le backend d’un réseau social privé",
  description:
    "Protège un fil d’équipe et organise publications, commentaires et mentions J’aime autour des comptes.",
  minutes: 105,
  requirements: [
    "Créer deux comptes et vérifier que le fil demande une authentification.",
    "Relier un commentaire à une publication et permettre à plusieurs membres d’aimer un même post.",
    "Vérifier que seul l’auteur peut modifier ou supprimer son commentaire, y compris avec une requête directe.",
  ],
  hints: [
    "Inscris-toi depuis l’accueil. L’API navigable permet de créer une publication ou un commentaire.",
    "Envoie POST à /api/publications/1/aimer/ pour ajouter une mention et DELETE pour la retirer. Adapte l’identifiant à ton post.",
    "Pour vérifier un refus, connecte-toi avec le deuxième compte et tente un PATCH ou un DELETE sur le commentaire du premier.",
  ],
  files: djangoFiles("Réseau privé", {
    rest: true,
    entry: "atelier/api.py",
    views: `from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect, render


def home(request):
    return render(request, "home.html")

${signup}`,
    urls: `from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import api, views

router = DefaultRouter()
router.register("publications", api.PostViewSet)
router.register("commentaires", api.CommentViewSet)
urlpatterns = [
    path("", views.home, name="home"),
    path("inscription/", views.signup, name="signup"),
    path("api/", include(router.urls)),
]
`,
    home: djangoPage(
      "Réseau privé",
      `<h1>Le fil d’équipe</h1>
<p>Un espace de pratique pour les membres connectés.</p>
<div class="actions">
  {% if user.is_authenticated %}
    <a href="/api/publications/">Publications</a>
    <a href="/api/commentaires/">Commentaires</a>
  {% else %}
    <a href="{% url 'signup' %}">Créer un compte</a>
    <a href="{% url 'login' %}">Se connecter</a>
  {% endif %}
</div>`,
    ),
    sources: {
      "templates/signup.html": signupPage,
      "atelier/models.py": `from django.conf import settings
from django.db import models


class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=120)
    body = models.TextField(max_length=2000)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="liked_posts", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    body = models.TextField(max_length=1500)
    created_at = models.DateTimeField(auto_now_add=True)
`,
      "atelier/serializers.py": `from rest_framework import serializers

from .models import Comment, Post


class PostSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.get_username", read_only=True)
    like_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ["id", "author", "title", "body", "created_at", "like_count"]

    def get_like_count(self, post):
        return post.likes.count()


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.get_username", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "post", "author", "body", "created_at"]

    def validate_post(self, post):
        if self.instance and self.instance.post_id != post.pk:
            raise serializers.ValidationError("Un commentaire garde sa publication.")
        return post
`,
      "atelier/api.py": `from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response

from .models import Comment, Post
from .serializers import CommentSerializer, PostSerializer


class AuthorWrites(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in SAFE_METHODS or obj.author_id == request.user.pk


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.select_related("author").prefetch_related("likes").order_by("-id")
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, AuthorWrites]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["post", "delete"], permission_classes=[IsAuthenticated], url_path="aimer")
    def like(self, request, pk=None):
        post = self.get_object()
        liked = request.method == "POST"
        if liked:
            post.likes.add(request.user)
        else:
            post.likes.remove(request.user)
        return Response({"liked": liked, "like_count": post.likes.count()})


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related("author", "post").order_by("id")
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, AuthorWrites]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
`,
    },
    notes:
      "Crée deux comptes via /inscription/. L’API navigable se trouve dans /api/. Pour tester les permissions, connecte-toi avec un compte différent de l’auteur et tente de modifier son commentaire.",
  }),
};

export const djangoProjects: [WebProject[], WebProject[], WebProject[]] = [
  [blog, quotes],
  [todo, ads],
  [shop, social],
];
