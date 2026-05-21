using AutoMapper;
using CustomerService.DTOs;
using CustomerService.Models;

namespace CustomerService.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // TestDrive Mappings
            CreateMap<TestDrive, TestDriveDto>()
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name : null));
            CreateMap<CreateTestDriveRequest, TestDrive>();
            CreateMap<UpdateTestDriveRequest, TestDrive>();

            // Customer Mappings
            CreateMap<Customer, CustomerDto>();
            CreateMap<CustomerCreateDto, Customer>();
            CreateMap<CreateCustomerRequest, Customer>();
            CreateMap<UpdateCustomerRequest, Customer>();

            // Purchase Mappings
            CreateMap<Purchase, PurchaseDto>();

            // Complaint Mappings
            CreateMap<Complaint, ComplaintDto>();
            CreateMap<CreateComplaintRequest, Complaint>();
            CreateMap<UpdateComplaintRequest, Complaint>();
        }
    }
}
