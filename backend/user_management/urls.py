from django.urls import path

from .views import (
    CookieLogoutView,
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    ProfileView,
    RegisterStep1View,
    RegisterStep2View,
    UserAdminDetailView,
    UserListAdminView,
)

urlpatterns = [
    path("auth/login/", CookieTokenObtainPairView.as_view(), name="auth_login"),
    path("auth/refresh/", CookieTokenRefreshView.as_view(), name="auth_refresh"),
    path("auth/logout/", CookieLogoutView.as_view(), name="auth_logout"),
    path("me/", ProfileView.as_view(), name="auth_me"),
    path("register/step1/", RegisterStep1View.as_view(), name="register-step1"),
    path("register/step2/", RegisterStep2View.as_view(), name="register-step2"),
    path("admin/users/", UserListAdminView.as_view(), name="admin-user-list"),
    path("admin/users/<int:pk>/", UserAdminDetailView.as_view(), name="admin-user-detail"),
]