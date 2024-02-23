<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\User;
use App\Models\Service;
use App\Models\Customer;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
{
    public function user($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $customers = $user->customers;

        if ($customers->isEmpty()) {
            return response()->json(['message' => 'No customers found for this user'], 404);
        }
    
        // Retrieve all invoices associated with the customer IDs
        $customerIds = $customers->pluck('id');
        $invoices = Invoice::whereIn('customer_id', $customerIds)->with('customer')->get();
    
        return response()->json(['invoices' => $invoices], 200);
    
    }
    public function index()
    {
        $invoices = Invoice::with('customer')->get();
       // $invoices = Invoice::all();
        return $invoices;
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:customers,id',
            'tax' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0|max:100',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Fetch all services associated with the provided customer ID
        $services = Service::where('customer_id', $request->customer_id)->get();
       
        // Calculate total amount
        $totalAmount = $services->sum('rate');
        
        // Apply tax and discount calculations
        $taxAmount = $totalAmount * ($request->tax / 100);
        $discountAmount = $totalAmount * ($request->discount / 100);
        $finalAmount = $totalAmount + $taxAmount - $discountAmount;
    
        // Create a new invoice instance
        $invoice = new Invoice();
        $invoice->amount = $finalAmount;
        $invoice->tax = $request->tax;
        $invoice->customer_id = $request->customer_id;
        $invoice->discount = $request->discount;
        $invoice->save();
        
        // Attach services to the invoice
      //  $invoice->services()->attach($services->pluck('id')->toArray());
        
        return response()->json(['invoice' => $invoice]);
    }
    public function show($id)
    {
        try {
           
              $invoice = Invoice::find($id);
          
              if (!$invoice) {
                return response()->json(['message' => 'Invoice not found'], 404);
            }
            $invoiceData = [
                'id' => $invoice->id,
                'customer_id' => $invoice->customer_id,
                'discount' => $invoice->discount,
                'tax' => $invoice->tax,
                'amount' => $invoice->amount,
                'created_at' => $invoice->created_at,
                'updated_at' => $invoice->updated_at,
                'status' => $invoice->status,
            ];
            $customerId = $invoice->customer->id;
            $customer = Customer::find($customerId);
            $services = Service::Where('customer_id',$customerId)->get();
            
            return response()->json(['invoice' => $invoice, 'services' => $services,'customer'=> $customer], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve data'], 500);
        }
    }
    public function update(Request $request, $id)
    {
       // Validate incoming request data
    $request->validate([
        'discount' => 'nullable|numeric',
        'tax' => 'nullable|numeric',
        // Add more validation rules as needed
    ]);

    // Find the invoice by its ID
    $invoice = Invoice::find($id);

    // Check if the invoice exists
    if (!$invoice) {
        return response()->json(['message' => 'Invoice not found'], 404);
    }

    // Update invoice details based on the request data
    $invoice->discount = $request->input('discount', $invoice->discount);
    $invoice->tax = $request->input('tax', $invoice->tax);
    $invoice->status = $request->input('status', $invoice->status);
    // Update other fields as needed
    $services = Service::where('customer_id',  $invoice->customer_id)->get();
       
    // Calculate total amount
    $totalAmount = $services->sum('rate');
        
        // Apply tax and discount calculations
        $taxAmount = $totalAmount * ($request->tax / 100);
        $discountAmount = $totalAmount * ($request->discount / 100);
        $finalAmount = $totalAmount + $taxAmount - $discountAmount;
        $invoice->amount =  $finalAmount;
    // Save the updated invoice
    $invoice->save();

    // Return a success response
    return response()->json(['message' => 'Invoice updated successfully', 'invoice' => $invoice], 200);
 
    }
    public function destroy($id)
    {
        // Deletion logic here
    }
}
