using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace PlaySyncApi
{
    public class SwaggerFileOperationFilter: IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var formFileParams = context.MethodInfo
                .GetParameters()
                .Where(p => p.ParameterType == typeof(IFormFile) ||
                            (p.ParameterType.IsClass && p.ParameterType.GetProperties().Any(prop => prop.PropertyType == typeof(IFormFile))))
                .ToList();

            if (!formFileParams.Any()) return;

            operation.RequestBody = new OpenApiRequestBody
            {
                Content =
            {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = formFileParams
                            .SelectMany(p => p.ParameterType.GetProperties())
                            .Where(p => p.PropertyType == typeof(IFormFile))
                            .ToDictionary(
                                prop => prop.Name,
                                prop => new OpenApiSchema { Type = "string", Format = "binary" }
                            )
                    }
                }
            }
            };
        }
    }
}
