using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;

namespace api.Helpers
{
    public class Pagination<T> where T : class
    {
        public Pagination(int pageIndex, int pageSize, int count, IReadOnlyList<T> data)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            Count = count;
            Data = data;
        }

        public int PageIndex { get; init; }
        public int PageSize { get; init; }
        public int Count { get; init; }
        public IReadOnlyList<T> Data { get; init; }
         
    }
}