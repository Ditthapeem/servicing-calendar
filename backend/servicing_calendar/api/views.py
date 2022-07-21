import re
from django.shortcuts import render
from django.http import JsonResponse

def getRoutes(request):
    """
    Specifide the end point of each path.

    Args:
        request: The request from web page.

    Returns:
        JsonResponse with list of end point.
    """
    return JsonResponse("Our API", safe=False)
