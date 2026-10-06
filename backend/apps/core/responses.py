from rest_framework.response import Response
from rest_framework import status as http_status

def api_response(success=True, message="", data=None, errors=None,
                  status=http_status.HTTP_200_OK):
    body = {
        'success': success,
        'message': message,
    }

    if success:
        body['data'] = data
    else:
        body['errors'] = errors

    return Response(body, status=status)

def success_response(message="Success", data=None, status=http_status.HTTP_200_OK):
    return api_response(True, message, data=data, status=status)

def error_response(message="Something went wrong", errors=None, 
                   status=http_status.HTTP_400_BAD_REQUEST):
    return api_response(False, message, errors=errors, status=status)