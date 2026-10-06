from rest_framework.pagination import PageNumberPagination
from apps.core.responses import success_response, error_response

class CustomPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = "page_size"
    max_page_size = 100
    message = "Data fetched successfully"

    def get_paginated_response(self, data):
        return success_response(self.message, {
            "count": self.page.paginator.count,
            "page": self.page.number,
            "page_size": self.page.paginator.per_page,
            "total_pages": self.page.paginator.num_pages,
            "start_index": self.page.start_index(),
            "end_index": self.page.end_index(),
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data,
        })