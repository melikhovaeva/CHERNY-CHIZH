from typing import Optional

from rest_framework.pagination import LimitOffsetPagination
from rest_framework.request import Request


DOGS_PAGE_SIZE = 20


class DogPagination(LimitOffsetPagination):
    """
    Пагинация для списков собак/щенков.

    Поддерживает:
    - page: номер страницы, начиная с 1
    - skip: смещение (offset) от начала списка
    - page_size: количество элементов на странице
    """

    default_limit = DOGS_PAGE_SIZE
    max_limit: Optional[int] = DOGS_PAGE_SIZE * 5

    page_query_param = "page"
    skip_query_param = "skip"
    page_size_query_param = "page_size"

    def get_limit(self, request: Request) -> Optional[int]:
        """
        Определяем размер страницы:
        - page_size имеет приоритет
        - иначе используем default_limit
        """
        page_size_param = request.query_params.get(self.page_size_query_param)

        if page_size_param is not None:
            try:
                page_size = int(page_size_param)
            except (TypeError, ValueError):
                page_size = self.default_limit
        else:
            page_size = self.default_limit

        if page_size <= 0:
            page_size = self.default_limit

        if self.max_limit is not None and page_size > self.max_limit:
            page_size = self.max_limit

        return page_size

    def get_offset(self, request: Request) -> int:
        """
        Определяем смещение:
        - если есть skip, используем его
        - иначе, если есть page, считаем offset = (page - 1) * page_size
        - иначе используем стандартное поведение LimitOffsetPagination (offset/limit)
        """
        params = request.query_params

        skip_param = params.get(self.skip_query_param)
        if skip_param is not None:
            try:
                skip = int(skip_param)
            except (TypeError, ValueError):
                skip = 0
            return max(skip, 0)

        page_param = params.get(self.page_query_param)
        if page_param is not None:
            try:
                page = int(page_param)
            except (TypeError, ValueError):
                page = 1

            if page < 1:
                page = 1

            limit = self.get_limit(request) or 0
            return max((page - 1) * limit, 0)

        return super().get_offset(request)

