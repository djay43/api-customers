<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CustomerRepository")
 * @ApiResource(
 *     collectionOperations={"GET","POST"},
 *     itemOperations={"GET","PUT","DELETE"},
 *     subresourceOperations={
"invoices_get_subresource"={"path"="/customers/{id}/invoices"}
 *     },
 *     normalizationContext={
 *          "groups"={"customers_read"}
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *          "firstName":"partial","lastName","company"
 *     })
 * @ApiFilter(OrderFilter::class)
 */
class Customer
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"customers_read","invoices_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read","invoices_read"})
     * @Assert\NotBlank(message="Le prénom est obligatoire")
     * @Assert\Length(min="3",
     *                minMessage="Le prénom doit faire en 3 et 255 caractères",
     *                max="255",
     *                maxMessage="Le prénom doit faire en 3 et 255 caractères")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read","invoices_read"})
     * @Assert\NotBlank(message="Le nom de famille est obligatoire")
     * @Assert\Length(min="3",
     *                minMessage="Le nom de famille doit faire en 3 et 255 caractères",
     *                max="255",
     *                maxMessage="Le nom de famille doit faire en 3 et 255 caractères")
     */

    private $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read","invoices_read"})
     * @Assert\NotBlank(message="L'email est obligatoire")
     * @Assert\Email(message="Le format de l'adresse email doit être valide"))
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customers_read","invoices_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Invoice", mappedBy="customer")
     * @Groups({"customers_read"})
     * @ApiSubresource
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="customers")
     * @Groups({"customers_read"})
     * @Assert\NotBlank(message="L'utilisateur est obligatoire")
     */
    private $user;

    /**
     * Customer constructor.
     */
    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * Get Invoices
     * @Groups({"customers_read"})
     *
     * @return float
     */
    public function getTotalAmount(): float
    {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice) {
            return $total + $invoice->getAmount();
        }, 0);
    }

    /**
     * Get UnPaid Amount (except PAID or CANCELLED)
     * @Groups({"customers_read"})
     *
     * @return float
     */
    public function getUnpaidAmount(): float
    {
        return array_reduce($this->getInvoices()->toArray(), function ($total, $invoice) {
            return $total + ($invoice->getStatus() === "PAID" || $invoice->getStatus() === "CANCELLED" ? 0 : $invoice->getAmount());
        }, 0);
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return null|string
     */
    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    /**
     * @param string $firstName
     *
     * @return Customer
     */
    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    /**
     * @param string $lastName
     *
     * @return Customer
     */
    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     *
     * @return Customer
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getCompany(): ?string
    {
        return $this->company;
    }

    /**
     * @param null|string $company
     *
     * @return Customer
     */
    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    /**
     * @param Invoice $invoice
     *
     * @return Customer
     */
    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    /**
     * @param Invoice $invoice
     *
     * @return Customer
     */
    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->contains($invoice)) {
            $this->invoices->removeElement($invoice);
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    /**
     * @return User|null
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User|null $user
     *
     * @return Customer
     */
    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
