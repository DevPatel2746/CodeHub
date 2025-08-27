"""
URL configuration for projecthub project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static
from login import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('login.urls')),  # ✅ This line connects login app URLs
    path('api/upload-solution/', views.upload_solution, name='upload_solution'),
    path('api/solutions/', views.get_solutions, name='get_solutions'),
    path("api/leaderboard/", views.leaderboard_view, name="leaderboard"),
    # path('', include('login.urls')),
    path("api/stats/overview/", views.user_stats, name="user-stats"),
    path("api/stats/company/", views.company_stats, name="company_stats"),
]

# serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)