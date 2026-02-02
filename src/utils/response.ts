type Pagination = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLastPage: boolean;
};

type Response<T> = {
  success: boolean;
  data?: T;
  pagination?: Pagination;
};


export function success<T>(data?: T, pagination?: Pagination): Response<T> {
  const res: Response<T> = {
    success: true,
  };

  if (data) {
    res.data = data;
  }

  if (pagination) {
    res.pagination = pagination;
  }

  return res;
}

export function error(message: string) {
  return {
    success: false,
    error: message,
  };
}
