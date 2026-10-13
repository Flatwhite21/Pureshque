import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .tasks import generate_recipes_xlsx_task, generate_diary_pdf_task

class ExportRecipesXLSXView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_path = f"/app/media/exports/recipes_{request.user.id}.xlsx"
        task = generate_recipes_xlsx_task.delay(request.user.id, file_path)
        return Response({
            'task_id': task.id,
            'status': 'processing',
            'file_url': f"/media/exports/recipes_{request.user.id}.xlsx",
        })

class ExportDiaryPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        p_start = request.data.get('period_start', '2026-10-01')
        p_end = request.data.get('period_end', '2026-10-13')
        file_path = f"/app/media/exports/diary_{request.user.id}_{p_start}_{p_end}.pdf"
        task = generate_diary_pdf_task.delay(request.user.id, p_start, p_end, file_path)
        return Response({
            'task_id': task.id,
            'status': 'processing',
            'file_url': f"/media/exports/diary_{request.user.id}_{p_start}_{p_end}.pdf",
        })
