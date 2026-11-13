from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('Accounts.urls')),
    path('api/forum/', include('Forum.urls')),
    path('api/jobs/',include('Jobs.urls')),
    path('api/messaging/', include('Messaging.urls')),
    path('api/groups/', include('Groups.urls')),
    path('api/moderation/', include('Moderation.urls')),
    path('api/learning/', include('Learning.urls')),
    path('api/code-execution/', include('CodeExecution.urls')),
    path('api/agents/', include('Agents.urls')),  # Agent IA pour FloatingTutor

    #path('social-auth/', include('social_django.urls', namespace='social')),
    path('social-auth/', include('social_django.urls', namespace='social')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
