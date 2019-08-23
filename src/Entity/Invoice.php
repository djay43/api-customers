<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 * @ApiResource(
 *     subresourceOperations={
 *          "api_customers_invoices_get_subresource" = {
"normalization_context" = {"groups"={"invoices_subresource"}}
 *          }
 *     },
 *     attributes={
 *          "pagination_enabled" = false,
 *          "pagination_items_per_page" = 20,
 *          "order" : {"sentAt":"desc"}
 *     },
 *     normalizationContext={
 *          "groups"={"invoices_read"}
 *     },
 *     denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(OrderFilter::class, properties={
 *          "amount","sentAt"
 *     })
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le montant est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit être un numérique")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\DateTime(message="La date doit être au format YYYYY-MM-DD")
     * @Assert\NotBlank(message="La date d'envoi doit être renseigné")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le status doit être renseigné")
     * @Assert\Choice(choices={"SENT","PAID", "CANCELLED"}, message="Le status doit être SENT, PAID ou CANCELLED")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="Le client doit être renseigné")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le chrono doit être renseigné")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre")
     */
    private $chrono;

    /**
     * Get User related to the invoice
     * @Groups({"invoices_read", "invoices_subresource"})
     *
     * @return User
     */
    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return float|null
     */
    public function getAmount(): ?float
    {
        return $this->amount;
    }

    /**
     * @param float $amount
     *
     * @return Invoice
     */
    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * @return \DateTimeInterface|null
     */
    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    /**
     * @param \DateTimeInterface $sentAt
     *
     * @return Invoice
     */
    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getStatus(): ?string
    {
        return $this->status;
    }

    /**
     * @param string $status
     *
     * @return Invoice
     */
    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return Customer|null
     */
    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    /**
     * @param Customer|null $customer
     *
     * @return Invoice
     */
    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    /**
     * @param int $chrono
     *
     * @return Invoice
     */
    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
