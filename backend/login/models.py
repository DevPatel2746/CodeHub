from django.db import models

class CustomUser(models.Model):
    USER_TYPES = (
        ('user', 'User'),
        ('company', 'Company'),
    )

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    user_type = models.CharField(max_length=10, choices=USER_TYPES)

    def __str__(self):
        return f"{self.name} ({self.user_type})"

class CompanyTask(models.Model):
    company_name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    question = models.TextField()
    response = models.TextField(blank=True)  # Optional response field
    task_type = models.CharField(max_length=20, blank=True, null=True)
    date = models.DateField(blank=True, null=True)


    def __str__(self):
        return f"{self.title} ({self.company_name})"
    

class Solutions(models.Model):
    username = models.CharField(max_length=150)            # stores user name (or email)
    question = models.CharField(max_length=100)                           # new field for question text
    solution = models.FileField(upload_to='solutions/')    # uploaded file saved under MEDIA_ROOT/solutions/
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.solution.name if self.solution else 'no-file'}"
