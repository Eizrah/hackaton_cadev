from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .serializers import InscriptionSerializer, ConnexionSerializer, DevelopperSerializer
from .models import Developper
import os
from django.db.models import Q

class InscriptionView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='5/h', method='POST', block=True))
    def post(self, request):
        serializer = InscriptionSerializer(data=request.data)
        if serializer.is_valid():
            dev = serializer.save()
            refresh = RefreshToken.for_user(dev)
            return Response({
                'message': 'Compte créé avec succès.',
                'email': dev.email,
                'nom': dev.nom,
                'prenom': dev.prenom,
                'pseudo': dev.pseudo,
                'age': dev.age,
                'pays': dev.pays,
                'sexe': dev.sexe,
                'lien_portfolio': dev.lien_portfolio,
                'lien_github': dev.lien_github,
                'point_penalite': dev.point_penalite,
                'tokens':{
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConnexionView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='10/h', method='POST', block=True))
    def post(self, request):
        serializer = ConnexionSerializer(data=request.data)
        if serializer.is_valid():
            # email = serializer.validated_data['email']
            # password = serializer.validated_data['mot_de_passe']
            dev=serializer.validated_data['dev']
            refresh = RefreshToken.for_user(dev)
            return Response({
                'message': 'Connexion reussie.',
                'email':dev.email,                   
                
                'tokens':{
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DeconnexionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Déconnexion réussie.'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'erreur': 'Token invalide.'}, status=status.HTTP_400_BAD_REQUEST)

class ProfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = DevelopperSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = DevelopperSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MotDePasseOublieView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='3/h', method='POST', block=True))
    def post(self, request):
        email = request.data.get('email')
        try:
            dev = Developper.objects.get(email=email)
            token = default_token_generator.make_token(dev)
            uid = urlsafe_base64_encode(force_bytes(dev.pk))
            frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
            reset_link = f"{frontend_url}/reset-password/{uid}/{token}/"

            # lien que le frontend utilisera pour réinitialiser le mot de passe
            #reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
            send_mail(
                subject='Réinitialisation de votre mot de passe',
                message=f'Cliquez sur ce lien pour réinitialiser votre mot de passe : {reset_link}',
                from_email='noreply@cadev.com',
                recipient_list=[email],
            )
        except Developper.DoesNotExist:
            pass  # on ne révèle pas si l'email existe ou non
        return Response({'message': 'Si cet email existe, un lien a été envoyé.'}, status=status.HTTP_200_OK)



class ReinitialisationMotDePasseView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            dev = Developper.objects.get(pk=uid)
        except (Developper.DoesNotExist, ValueError):
            return Response({'erreur': 'Lien invalide.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(dev, token):
            return Response({'erreur': 'Lien expiré ou invalide.'}, status=status.HTTP_400_BAD_REQUEST)

        password = request.data.get('password')
        if not password or len(password) < 8:
            return Response({'erreur': 'Le mot de passe doit contenir au moins 8 caractères.'}, status=status.HTTP_400_BAD_REQUEST)

        dev.set_password(password)
        dev.save()
        return Response({'message': 'Mot de passe réinitialisé avec succès.'}, status=status.HTTP_200_OK)


class SupprimerCompteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        dev = request.user
        # on déconnecte le dev en invalidant son refresh token s'il est fourni
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass  # on continue la suppression même si le token est invalide

        # la suppression du dev déclenchera automatiquement le signal post_delete
        # qui supprimera la photo de profil du disque
        dev.delete()
        return Response({'message': 'Compte supprimé avec succès.'}, status=status.HTTP_200_OK)

class RechercheDeveloppeurView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '')

        if not query:
            return Response(
                {'erreur': 'Veuillez fournir un mot clé de recherche.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # cherche dans pseudo, nom et prenom
        devs = Developper.objects.filter(
            Q(pseudo__icontains=query) |
            Q(nom__icontains=query) |
            Q(prenom__icontains=query),
            banne=False
        )

        serializer = DevelopperSerializer(devs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)