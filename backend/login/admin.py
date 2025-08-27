from django.contrib import admin
from .models import CustomUser, CompanyTask,Solutions  # ✅ Import both models

# Admin customization for CustomUser (already exists)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'user_type')
    search_fields = ('name', 'email')
    list_filter = ('user_type',)

admin.site.register(CustomUser, CustomUserAdmin)

# ✅ New admin configuration for CompanyTask
class CompanyTaskAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'title', 'question', 'response', 'task_type', 'date')  # ✅ Add fields here
    search_fields = ('company_name', 'title')
    list_filter = ('company_name',)

admin.site.register(CompanyTask, CompanyTaskAdmin)

admin.site.register(Solutions)
