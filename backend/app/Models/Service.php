<?php

namespace App\Models;

use App\Models\InvoiceLineItem;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    protected  $fillable =['customer_id','name','description','rate'];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
    
}
