using Microsoft.OpenApi.Models;
using PlaySyncApi.Filters.FileUpload;
using Microsoft.EntityFrameworkCore;
using DL;
using DL.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PlaySync API",
        Version = "v1",
        Description = "API for PlaySync application"
    });

    c.MapType<IFormFile>(() => new OpenApiSchema
    {
        Type = "object",
        Properties = new Dictionary<string, OpenApiSchema>
        {
            ["file"] = new OpenApiSchema
            {
                Description = "Upload File",
                Type = "string",
                Format = "binary"
            }
        }
    });

    c.OperationFilter<FileUploadOperationFilter>();
});
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

var app = builder.Build(); 

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "PlaySync API V1");
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
