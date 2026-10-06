from rest_framework.views import exception_handler
from apps.core.responses import error_response

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return None
    detail = response.data
    if isinstance(detail, dict) and "detail" in detail:
        return error_response(str(detail["detail"]), status=response.status_code)
    return error_response("Request failed", detail, status=response.status_code)