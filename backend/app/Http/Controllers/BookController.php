<?php

namespace App\Http\Controllers;

use App\Services\BookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function __construct(private BookService $bookService) {}

    public function index(): JsonResponse
    {
        return response()->json($this->bookService->getAll());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'author'        => 'nullable|string|max:255',
            'isbn'          => 'nullable|string|max:20',
            'thumbnail_url' => 'nullable|url',
            'description'   => 'nullable|string',
            'status'        => 'required|in:interested,reading,completed',
        ]);

        $book = $this->bookService->create($validated);

        return response()->json($book, 201);
    }
}
