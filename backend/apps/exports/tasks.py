from celery import shared_task

@shared_task
def export_recipes_task():
    return "Export recipes task completed"

@shared_task
def backup_database_task():
    return "Backup database task completed"
