<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Stadium;
use Illuminate\Http\Request;

class StadiumController extends Controller
{
    /**
     * GET /api/stadiums
     * Zwraca listę wszystkich stadionów w JSON.
     */
    public function index()
    {
        $stadiums = Stadium::all();
        return response()->json($stadiums);
    }

    /**
     * GET /api/stadiums/{id}
     */
    public function show($id)
    {
        return response()->json(
            Stadium::findOrFail($id),
            200
        );
    }

    /**
     * POST /api/stadiums
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name'     => 'required|string',
            'city'  => 'required|string',
            'street'  => 'required|string',
            'numberBuilding'  => 'required|string',
            'capacity' => 'required|integer|min:0',
        ]);

        $stadium = Stadium::create($request->only(['name','city', 'street','numberBuilding', 'capacity']));
        return response()->json($stadium, 201);
    }

    /**
     * PUT /api/stadiums/{id}
     */
    public function update(Request $request, $id)
    {
        $stadium = Stadium::findOrFail($id);
        $stadium->fill($request->only(['name','address','capacity']));
        $stadium->save();
        return response()->json($stadium);
    }

    /**
     * DELETE /api/stadiums/{id}
     */
    public function destroy($id)
    {
        Stadium::destroy($id);
        return response()->json(null, 204);
    }
}
