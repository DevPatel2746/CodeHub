from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required
from .models import CustomUser, CompanyTask,Solutions
from .serializers import CompanyTaskSerializer,SolutionsSerializer
from django.http import JsonResponse
from django.db.models import Count,F

# ---------------- Existing Auth Views ----------------

@api_view(['POST'])
def register_user(request):
    name = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    user_type = request.data.get("userType")

    if not name or not email or not password or not user_type:
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already registered."}, status=status.HTTP_400_BAD_REQUEST)

    CustomUser.objects.create(name=name, email=email, password=password, user_type=user_type)
    return Response({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_user(request):
    name = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not name or not email or not password:
        return Response({"error": "Username, email, and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(name=name, email=email, password=password)
        return Response({
            "message": "Login successful!",
            "userType": user.user_type
        }, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

# ---------------- Company Task Views ----------------

@api_view(['POST'])
def add_task(request):
    serializer = CompanyTaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Task added successfully."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_tasks(request, company_name):
    tasks = CompanyTask.objects.filter(company_name=company_name)
    serializer = CompanyTaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_task(request, task_id):
    try:
        task = CompanyTask.objects.get(id=task_id)
        task.delete()
        return Response({"message": "Task deleted successfully."}, status=status.HTTP_200_OK)
    except CompanyTask.DoesNotExist:
        return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def get_all_tasks(request):
    if request.method == "GET":
        tasks = CompanyTask.objects.all()
        data = []
        for task in tasks:
            data.append({
                "id": task.id,
                "company_name": task.company_name,
                "title": task.title,
                "question": task.question,
                "task_type": task.task_type,
                "date": task.date.strftime("%Y-%m-%d") if task.date else "",
                "response_count": 0  # Add logic if tracking responses separately
            })
        return JsonResponse(data, safe=False)
    
@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_solution(request):
    print(f"User: {request.user} Authenticated: {request.user.is_authenticated}")

    file = request.FILES.get('solution')
    question = request.POST.get('question')  # changed from task_id or task to question

    if not file or not question:
        return Response({"error": "Missing file or question"}, status=status.HTTP_400_BAD_REQUEST)

    username = request.user.username 

    solution_instance = Solutions.objects.create(
        username=username,
        solution=file,
        question=question
    )
    return Response({"message": "Solution uploaded successfully"}, status=status.HTTP_201_CREATED)

def get_solutions(request):
    data = list(Solutions.objects.values())
    return JsonResponse(data, safe=False)


# views.py
from django.http import JsonResponse
# from .models import Solution

def solutions_list(request):
    data = []
    for sol in Solutions.objects.all():
        data.append({
            "question": sol.question,
            "solution": sol.solution,
            "username": sol.username,
            "file_url": sol.file.url if sol.file else None  # ✅ send real path
        })
    return JsonResponse(data, safe=False)


from django.http import JsonResponse
from django.db.models import Count, F
from .models import Solutions

def leaderboard_view(request):
    leaderboard_data = (
        Solutions.objects
        .annotate(username_clean=F('username'))  # Copy username to a new alias
        .values('username_clean')
        .annotate(solutions_submitted=Count('id'))
        .order_by('-solutions_submitted')
    )

    ranked_data = []
    rank = 1
    for entry in leaderboard_data:
        ranked_data.append({
            "rank": rank,
            "username": entry['username_clean'].strip().upper(),
            "solutions_submitted": entry['solutions_submitted']
        })
        rank += 1

    return JsonResponse(ranked_data, safe=False)


from django.http import JsonResponse
from django.db.models import Q
from .models import CompanyTask, Solutions

def user_stats(request):
    username = request.GET.get("username")
    print("DEBUG: username from frontend =", username)

    if not username:
        return JsonResponse({"error": "Username required"}, status=400)

    total_tasks = CompanyTask.objects.count()
    print("DEBUG: total_tasks =", total_tasks)

    # Generate variants
    username_nospace = username.replace(" ", "")   # USER 2 -> USER2
    username_withspace = (
        username_nospace[:-1] + " " + username_nospace[-1]
        if len(username_nospace) > 1 else username
    )

    username_variants = [username, username_nospace, username_withspace]

    query = Q()
    for variant in username_variants:
        query |= Q(username__iexact=variant)

    solved = Solutions.objects.filter(query)

    solved_total = solved.count()
    print("DEBUG: solved_tasks for", username_variants, "=", solved_total)

    solved_by_type = {"frontend": 0, "backend": 0, "fullstack": 0}

    for s in solved:
        try:
            # Use filter().first() instead of get()
            task = CompanyTask.objects.filter(title=s.question).first()
            if not task:
                continue
            task_type = (getattr(task, "task_type", "") or "").lower()
            if task_type in solved_by_type:
                solved_by_type[task_type] += 1
        except Exception as e:
            print("DEBUG: error while processing solution:", e)
            continue

    return JsonResponse({
        "username": username,
        "total_tasks": total_tasks,
        "solved_total": solved_total,
        "solved_by_type": solved_by_type,
    })


def company_stats(request):
    company_name = request.GET.get("company")  # frontend passes ?company=XYZ
    print(">>> Company from frontend:", company_name)
    if not company_name:
        return JsonResponse({"error": "Company name required"}, status=400)

    # Filter by company_name
    tasks = CompanyTask.objects.filter(company_name=company_name)

    total_tasks = tasks.count()
    frontend = tasks.filter(task_type__iexact="frontend").count()
    backend = tasks.filter(task_type__iexact="backend").count()
    fullstack = tasks.filter(task_type__iexact="fullstack").count()

    return JsonResponse({
        "company": company_name,
        "total_tasks": total_tasks,
        "frontend": frontend,
        "backend": backend,
        "fullstack": fullstack,
    })