from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
                username = user.username
                user = authenticate(username=username, password=password)
                if user is None:
                    raise serializers.ValidationError("Unable to log in with provided credentials.")
            except User.DoesNotExist:
                raise serializers.ValidationError("User with this email does not exist.")
        else:
            raise serializers.ValidationError("Must include 'email' and 'password'.")

        data['user'] = user
        return data
