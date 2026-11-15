"""
Script de test pour comprendre l'erreur 400 sur envoyer-audio
"""
import requests
import os

# URL de l'API
url = "http://localhost:8000/api/messaging/envoyer-audio/"

# Token d'authentification (remplacez par un vrai token)
# Vous pouvez le récupérer depuis localStorage dans la console du navigateur
token = input("Entrez votre access_token JWT: ")

# Email du destinataire
destinataire = input("Entrez l'email du destinataire: ")

# Créer un fichier audio de test (vide pour le test)
test_audio_path = "test_audio.webm"
with open(test_audio_path, "wb") as f:
    # En-tête WebM minimal
    f.write(bytes.fromhex('1a45dfa3'))
    f.write(b'\x00' * 100)

# Préparer les données
files = {'fichier_audio': open(test_audio_path, 'rb')}
data = {
    'destinataire': destinataire,
    'contenu': ''
}
headers = {
    'Authorization': f'Bearer {token}'
}

# Envoyer la requête
response = requests.post(url, files=files, data=data, headers=headers)

print(f"\nStatus Code: {response.status_code}")
print(f"Response: {response.text}")

# Nettoyer
os.remove(test_audio_path)
