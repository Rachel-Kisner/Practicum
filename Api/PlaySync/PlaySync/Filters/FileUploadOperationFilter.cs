using System;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.OpenApi.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ApiExplorer;

namespace PlaySyncApi.Filters.FileUpload
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var formFileParameters = context.ApiDescription.ParameterDescriptions
                .Where(p => p.ParameterDescriptor.ParameterType == typeof(IFormFile))
                .ToList();

            foreach (var parameter in formFileParameters)
            {
                var fileParameter = operation.Parameters
                    .FirstOrDefault(p => p.Name == parameter.Name);

                if (fileParameter != null)
                {
                    fileParameter.Schema.Type = "string";
                    fileParameter.Schema.Format = "binary";
                }
            }
        }
    }

}