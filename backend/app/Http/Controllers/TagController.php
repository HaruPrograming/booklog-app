<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Services\TagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function __construct(private TagService $tagService) {}

    public function index(): JsonResponse
    {
        return response()->json($this->tagService->getAll());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:tags,name',
        ]);

        return response()->json($this->tagService->create($validated), 201);
    }

    public function destroy(Tag $tag): JsonResponse
    {
        $this->tagService->delete($tag);

        return response()->json(null, 204);
    }
}
