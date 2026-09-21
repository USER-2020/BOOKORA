<?php

namespace App\Support;

use App\Models\Business;

class CurrentBusiness
{
    private ?Business $business = null;

    public function set(Business $business): void
    {
        $this->business = $business;
    }

    public function get(): ?Business
    {
        return $this->business;
    }

    public function clear(): void
    {
        $this->business = null;
    }

    public function id(): int
    {
        abort_unless($this->business, 403, 'No active business selected.');

        return $this->business->id;
    }
}
