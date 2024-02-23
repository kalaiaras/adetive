<?php

namespace App\Models;
use App\Models\Service;
use App\Models\InvoiceLineItem;
use App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;
    protected $fillable = [
        'customer_id',
        'discount',
        'tax',
        'amount',
        'status',
       
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
    public function service()
    {
       
        return $this->hasMany(Service::class);
     //   return $this->belongsToMany(Service::class,'invoice_service'    );
    }
 
}
