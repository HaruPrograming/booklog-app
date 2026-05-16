<?php

namespace App\Http\Controllers;

use App\Services\IsbnSearchService;
use Illuminate\Http\Request;

class IsbnSearchController extends Controller
{
    public function __construct(private IsbnSearchService $isbnSearchService) {}

    public function search(Request $request)
    {
        $request->validate([
            'isbn' => ['required', 'regex:/^\d{10}(\d{3})?$/'],
        ]);

        $result = $this->isbnSearchService->search($request->isbn);

        if ($result === null) {
            return response()->json(['message' => '本が見つかりませんでした'], 404);
        }

        return response()->json($result);
    }
}
