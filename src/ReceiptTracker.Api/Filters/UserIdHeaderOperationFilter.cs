using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ReceiptTracker.Api.Filters;

/// <summary>
/// Auth placeholder, will be replaced by a JWT Bearer token scheme
/// </summary>
public class UserIdHeaderOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        operation.Parameters ??= [];

        operation.Parameters.Add(new OpenApiParameter
        {
            Name = "X-User-Id",
            In = ParameterLocation.Header,
            Required = false,
            Description = "User identifier for testing.",
            Schema = new OpenApiSchema
            {
                Type = "string",
                Default = new OpenApiString("test-user")
            }
        });
    }
}