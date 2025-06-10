using BL;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace PlaySyncApi
{
    public class FileUploadOperation: IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var formParams = context.MethodInfo.GetParameters()
                .Where(p => p.ParameterType == typeof(SongUploadDto));

            if (!formParams.Any()) return;

            operation.RequestBody = new OpenApiRequestBody
            {
                Content =
            {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = new Dictionary<string, OpenApiSchema>
                        {
                            ["file"] = new OpenApiSchema { Type = "string", Format = "binary" },
                            ["title"] = new OpenApiSchema { Type = "string" },
                            ["artist"] = new OpenApiSchema { Type = "string" },
                            ["genre"] = new OpenApiSchema { Type = "string" },
                            ["userId"] = new OpenApiSchema { Type = "string" }
                        },
                        Required = new HashSet<string> { "file", "title", "artist", "genre", "userId" }
                    }
                }
            }
            };
        }
    }

}

