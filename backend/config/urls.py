"""
URL configuration for application project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
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
import os

from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path("api/v1/", include("api_gateway.urls")),
]

# Раздавать статику средствами Django при локальной разработке (runserver).
# Использует staticfiles finders — не требует collectstatic.
# В проде статику раздаёт nginx — переменная DJANGO_SERVE_STATIC не задана.
if os.getenv("DJANGO_SERVE_STATIC", "False") == "True":
    from django.contrib.staticfiles.views import serve as staticfiles_serve
    from django.urls import re_path

    urlpatterns += [
        re_path(
            r"^static/(?P<path>.*)$",
            staticfiles_serve,
            {"insecure": True},
        ),
    ]
