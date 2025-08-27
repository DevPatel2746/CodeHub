from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('add-task/', views.add_task),
    path('tasks/<str:company_name>/', views.get_tasks),
    path('delete-task/<int:task_id>/', views.delete_task),
    path('tasks/', views.get_all_tasks),
    path('solutions/', views.get_solutions),
    # path("home/stats/", views.stats_overview, name="home_stats"),
    # path("stats/overview/", views.stats_overview, name="stats_overview"),
    # path('home/stats/<int:user_id>/', views.user_stats, name='user_stats'),
    # path("api/stats/overview/", views.stats_overview, name="stats_overview"),
    # path("api/stats/overview/", views.user_stats, name="user_stats"),
    # path("stats/overview/", views.user_stats, name="user_stats"),
    path("stats/company/", views.company_stats, name="company-stats"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
