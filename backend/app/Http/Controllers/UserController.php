<?php

namespace App\Http\Controllers;
use  App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class UserController extends Controller
{
 
    function signup(Request  $req){
         // Define validation rules
    $rules = [
        'username' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
    ];

    // Validate input data
    $validator = Validator::make($req->all(), $rules);

    // Check if validation fails
    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 400);
    }
        $user = new User;
        $user->username =$req -> input('username');
        $user->email =$req -> input('email');
        $user->password =Hash::make($req -> input('password'));
        $user->save();
        return $user;
    }

    function login(Request $req){
       // Define validation rules
    $rules = [
        'email' => 'required|email',
        'password' => 'required|string',
    ];

    // Validate input data
    $validator = Validator::make($req->all(), $rules);

    // Check if validation fails
    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 400);
    }

    // Attempt to authenticate user
    if (!Auth::attempt(['email' => $req->email, 'password' => $req->password])) {
        return response()->json(['error' => 'Email and Password not correct'], 401);
    }

    // Authentication successful, return user
    $user = Auth::user();
    return $user;
    }
    

   
}
