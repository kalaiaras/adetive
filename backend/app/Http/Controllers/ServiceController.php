<?php

namespace App\Http\Controllers;
use  App\Models\Service;
use  App\Models\User;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;
class ServiceController extends Controller
{

    public function index($userid)
    {
      
        $services = Service::where('customer_id',$userid)->get();
        return response()->json($services);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'rate' => 'required|numeric',
            'customer_id' => 'required|exists:customers,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Validation passed, create new service
        $service = new Service;
        $service->name = $request->name;
        $service->description = $request->description;
        $service->rate = $request->rate;
        $service->customer_id = $request->customer_id;
        $service->save();

        return response($service);
    }
    public function show($id)
    {
        $service = Service::findOrFail($id);
        return view('services.show', compact('service'));
    }
    public function edit($id)
    {
        $service = Service::findOrFail($id);
        return view('services.edit', compact('service'));
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'rate' => 'required|numeric',
            'customer_id' => 'required|exists:customers,id'
        ]);

        if ($validator->fails()) {
            return redirect('services/' . $id . '/edit')
                        ->withErrors($validator)
                        ->withInput();
        }

        // Validation passed, update the service
        $service = Service::findOrFail($id);
        $service->name = $request->name;
        $service->description = $request->description;
        $service->rate = $request->rate;
        $service->customer_id = $request->customer_id;
        $service->save();

        return response()->json([
            'status' => 'success',
            'message' => 'service updated successfully'
          
        ]);
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

       return response()->json([
            'status' => 'success',
            'message' => 'service deleted successfully'
          
        ]);
    }   
}
