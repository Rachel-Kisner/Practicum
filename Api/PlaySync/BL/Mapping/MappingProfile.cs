using AutoMapper;
using DL.Entities;
using BL.DTOs;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BL.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {

            CreateMap<Song, SongDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Name));

            // אם תרצי מיפוי הפוך (למשל POST): 
            CreateMap<SongDto, Song>();
        }
    }
}

