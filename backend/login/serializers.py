from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import CompanyTask , Solutions # 👈 import your task model

# 🔒 Existing serializer — DO NOT MODIFY
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

# 🆕 New serializer for CompanyTask
class CompanyTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyTask
        fields = '__all__'

class SolutionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solutions
        fields = ['id', 'UserName', 'Solution', 'file_url']  # Include 'UserName'
        read_only_fields = ['UserName']  # Make it read-only if we set it in backend
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None