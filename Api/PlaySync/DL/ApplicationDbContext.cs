using DL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DL
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<PlayList> Playlists { get; set; }
        public DbSet<PlaylistSong> PlaylistSongs { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Song>()
              .HasOne(s => s.User)  // שיר קשור למשתמש
              .WithMany(u => u.Songs)  // משתמש יכול להיות בעל הרבה שירים
               .HasForeignKey(s => s.UserId);

            // מפתח משולב
            modelBuilder.Entity<PlaylistSong>()
                .HasKey(ps => new { ps.PlaylistId, ps.SongId });


            modelBuilder.Entity<PlaylistSong>()
                .HasOne(ps => ps.Playlist)
                .WithMany(p => p.PlaylistSongs)
                .HasForeignKey(ps => ps.PlaylistId);

            modelBuilder.Entity<PlaylistSong>()
                .HasOne(ps => ps.Song)
                .WithMany(s => s.PlaylistSongs)
                .HasForeignKey(ps => ps.SongId);

            modelBuilder.Entity<Song>()
               .Property(s => s.CloudinaryUrl)
               .IsRequired();

            modelBuilder.Entity<Song>()
                .HasIndex(s => s.Title)
                .HasDatabaseName("Index_Song_Title");

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Song>()
               .HasOne(s => s.User)
               .WithMany(u => u.Songs)
               .HasForeignKey(s => s.UserId)
               .OnDelete(DeleteBehavior.Cascade);





        }

    }
}




