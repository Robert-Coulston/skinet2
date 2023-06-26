using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;

namespace api.Dtos
{
    public class AddressDto
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Street { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string State { get; set; }
        [Required]
        public string ZipCode { get; set; }

        public static readonly Func<Address, AddressDto>
            Projector =
                (address) =>
                    new AddressDto {
                        FirstName = address.FirstName,
                        LastName = address.LastName,
                        Street = address.Street,
                        City = address.City,
                        State = address.State,
                        ZipCode = address.ZipCode,
                    };

    }
}