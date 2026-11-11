from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Competence, Apprentissage
from .serializers import CompetenceSerializer, ApprentissageSerializer

# ─── Compétences ──────────────────────────────────────────────────────────────

class ListeCompetencesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # filtre optionnel par domaine : ?domaine=frontend
        domaine = request.query_params.get('domaine', None)
        competences = Competence.objects.all()
        if domaine:
            competences = competences.filter(domaine__icontains=domaine)
        serializer = CompetenceSerializer(competences, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DetailCompetenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_competence):
        try:
            competence = Competence.objects.get(id_competence=id_competence)
        except Competence.DoesNotExist:
            return Response(
                {'erreur': 'Compétence introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = CompetenceSerializer(competence)
        return Response(serializer.data, status=status.HTTP_200_OK)

# ─── Apprentissages ───────────────────────────────────────────────────────────

class ApprentissageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # filtre optionnel par avancement : ?avancement=en_cours
        avancement = request.query_params.get('avancement', None)
        apprentissages = Apprentissage.objects.filter(
            id_apprenant=request.user
        ).order_by('-date_debut')

        if avancement:
            apprentissages = apprentissages.filter(avancement=avancement)

        serializer = ApprentissageSerializer(apprentissages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # commence un nouvel apprentissage
        serializer = ApprentissageSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save(id_apprenant=request.user)
            return Response({
                'message': 'Apprentissage commencé.',
                'apprentissage': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DetailApprentissageView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            apprentissage = Apprentissage.objects.get(
                pk=pk,
                id_apprenant=request.user
            )
        except Apprentissage.DoesNotExist:
            return Response(
                {'erreur': 'Apprentissage introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ApprentissageSerializer(
            apprentissage, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            apprentissage = Apprentissage.objects.get(
                pk=pk,
                id_apprenant=request.user
            )
        except Apprentissage.DoesNotExist:
            return Response(
                {'erreur': 'Apprentissage introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        apprentissage.delete()
        return Response(
            {'message': 'Apprentissage abandonné.'},
            status=status.HTTP_200_OK
        )

# ─── Agent Assistant ───────────────────────────────────────────────────────────

class AssistantQuestionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get('question')
        technologie = request.data.get('technologie')

        if not question or not technologie:
            return Response(
                {'erreur': 'question et technologie sont obligatoires.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # appel direct au service agent
        from Agents.services.assistant_services import repondre_question
        reponse = repondre_question(
            question=question,
            technologie=technologie,
            niveau=request.user.niveau,
            email_dev=request.user.email
        )

        return Response({'reponse': reponse}, status=status.HTTP_200_OK)

class AssistantExerciceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        technologie = request.data.get('technologie')
        sujet = request.data.get('sujet')

        if not technologie or not sujet:
            return Response(
                {'erreur': 'technologie et sujet sont obligatoires.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from Agents.services.assistant_services import generer_exercice
        exercice = generer_exercice(
            technologie=technologie,
            niveau=request.user.niveau,
            sujet=sujet,
            email_dev=request.user.email
        )

        return Response({'exercice': exercice}, status=status.HTTP_200_OK)

class AssistantCorrigerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code_soumis = request.data.get('code')
        enonce = request.data.get('enonce')
        technologie = request.data.get('technologie')

        if not code_soumis or not enonce or not technologie:
            return Response(
                {'erreur': 'code, enonce et technologie sont obligatoires.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from Agents.services.assistant_services import corriger_code
        correction = corriger_code(
            code_soumis=code_soumis,
            enonce_exercice=enonce,
            technologie=technologie,
            email_dev=request.user.email
        )

        return Response({'correction': correction}, status=status.HTTP_200_OK)

class AssistantRecommenderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        domaine = request.data.get('domaine', 'général')

        # récupère les compétences actuelles du dev
        competences = list(
            request.user.possessions.values_list(
                'competence__nom_competence', flat=True
            )
        )

        from Agents.services.assistant_services import recommander_competences
        recommandations = recommander_competences(
            competences_actuelles=competences,
            niveau=request.user.niveau,
            domaine_interet=domaine,
            email_dev=request.user.email
        )
        

        return Response(
            {'recommandations': recommandations},
            status=status.HTTP_200_OK
        )
