<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\User;

use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    //
    public function index($userid)
    {
        $customers = Customer::where('user_id',$userid)->get();
        return response()->json($customers);
    }

    public function store(Request $request)
    {
     
       // Validation rules for the request
       $validator = Validator::make($request->all(), [
        'user_id' => 'required|exists:users,id',
        'phone_number' => 'required|string|max:255',
        'address' => 'required|string|max:255',
        'customer_name' => 'required|string|max:255',
    ]);
    
    // Check if validation fails
    if ($validator->fails()) {
        return redirect()->back()->withErrors($validator)->withInput();
    }

    // Create new customer instance
    $customer = new Customer();
    $customer->user_id = $request->user_id;
    $customer->phone_number = $request->phone_number;
    $customer->address = $request->address;
    $customer->customer_name = $request ->customer_name; 
    // Save the customer
    $customer->save();

    return response($customer);

    }

    public function show($id)
    {
        $customer = Customer::findOrFail($id);
        return view('customers.show', compact('customer'));
    }

    public function edit($id)
    {
        $customer = Customer::findOrFail($id);
        return response($customer);
    }

    public function update(Request $request, $id)
    {
        // Validation rules for the request
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
        

        // Find the customer by ID
        $customer = Customer::findOrFail($id);

        // Update customer data
        $customer->customer_name = $request->customer_name;
        $customer->phone_number = $request->phone_number;
        $customer->address = $request->address;

        // Save the updated customer
        $customer->save();

        return response($customer);
    }
    public function destroy($id)
    {
        // Find the customer by ID and delete it
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully');
    }
}
