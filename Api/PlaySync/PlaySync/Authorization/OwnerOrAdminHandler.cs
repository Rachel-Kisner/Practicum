using DL;
using Microsoft.AspNetCore.Authorization;
using PlaySyncApi.Authorization;
using System.Security.Claims;

public class OwnerOrAdminHandler : AuthorizationHandler<OwnerOrAdminRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ApplicationDbContext _context; 

    public OwnerOrAdminHandler(IHttpContextAccessor httpContextAccessor, ApplicationDbContext context)
    {
        _httpContextAccessor = httpContextAccessor;
        _context = context;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, OwnerOrAdminRequirement requirement)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = context.User.FindFirst(ClaimTypes.Role)?.Value;

        if (role == "Admin")
        {
            context.Succeed(requirement);
            return;
        }

        if (httpContext?.Request?.RouteValues?.TryGetValue("songId", out var songIdObj) == true &&
            int.TryParse(songIdObj?.ToString(), out int songId) &&
            int.TryParse(userId, out int uid))
        {
            var song = await _context.Songs.FindAsync(songId);
            if (song != null && song.UserId == uid)
            {
                context.Succeed(requirement);
            }
        }
    }
}

