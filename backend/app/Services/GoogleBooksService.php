<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GoogleBooksService
{
    private string $baseUrl = 'https://www.googleapis.com/books/v1/volumes';

    public function search(string $query, int $maxResults = 20): array
    {
        $params = ['q' => $query, 'maxResults' => $maxResults];

        $apiKey = config('services.google_books.key', '');
        if ($apiKey) {
            $params['key'] = $apiKey;
        }

        $response = Http::get($this->baseUrl, $params);

        if (!$response->successful()) {
            return [];
        }

        return array_map(
            fn($item) => $this->formatBook($item),
            $response->json('items', [])
        );
    }

    public function getDetail(string $id): ?array
    {
        $params = [];
        $apiKey = config('services.google_books.key', '');
        if ($apiKey) {
            $params['key'] = $apiKey;
        }

        $response = Http::get("{$this->baseUrl}/{$id}", $params);

        if (!$response->successful()) {
            return null;
        }

        $item     = $response->json();
        $formatted = $this->formatBook($item);

        $seriesId = $item['seriesInfo']['bookSeries'][0]['seriesId'] ?? null;
        if ($seriesId) {
            $formatted['series_volume_count'] = $this->getSeriesVolumeCount($seriesId, $params);
        }

        return $formatted;
    }

    private function getSeriesVolumeCount(string $seriesId, array $baseParams): int
    {
        $params = array_merge($baseParams, [
            'q'          => "seriesid:{$seriesId}",
            'maxResults' => 40,
            'fields'     => 'items/seriesInfo/bookSeries/orderNumber',
        ]);

        $response = Http::get($this->baseUrl, $params);
        if (!$response->successful()) {
            return 0;
        }

        $max = 0;
        foreach ($response->json('items', []) as $item) {
            $order = (int) ($item['seriesInfo']['bookSeries'][0]['orderNumber'] ?? 0);
            if ($order > $max) {
                $max = $order;
            }
        }

        return $max;
    }

    private function formatBook(array $item): array
    {
        $info    = $item['volumeInfo'] ?? [];
        $authors = $info['authors'] ?? [];
        $isbns   = $info['industryIdentifiers'] ?? [];

        $isbn = collect($isbns)->firstWhere('type', 'ISBN_13')['identifier']
            ?? collect($isbns)->firstWhere('type', 'ISBN_10')['identifier']
            ?? null;

        $thumbnail = $info['imageLinks']['thumbnail']
            ?? $info['imageLinks']['smallThumbnail']
            ?? null;

        $seriesInfo   = $item['seriesInfo'] ?? [];
        $seriesName   = $seriesInfo['shortSeriesBookTitle'] ?? null;
        $volumeNumber = isset($seriesInfo['bookSeries'][0]['orderNumber'])
            ? (int) $seriesInfo['bookSeries'][0]['orderNumber']
            : null;

        return [
            'google_books_id'     => $item['id'],
            'title'               => $info['title'] ?? '不明なタイトル',
            'author'              => !empty($authors) ? implode(' ', $authors) : null,
            'isbn'                => $isbn,
            'thumbnail_url'       => $thumbnail,
            'description'         => isset($info['description']) ? strip_tags($info['description']) : null,
            'average_rating'      => $info['averageRating'] ?? null,
            'ratings_count'       => $info['ratingsCount'] ?? null,
            'published_date'      => $info['publishedDate'] ?? null,
            'series_name'         => $seriesName,
            'volume_number'       => $volumeNumber,
            'series_volume_count' => null,
        ];
    }
}
