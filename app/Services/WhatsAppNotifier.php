<?php

namespace App\Services;

use App\Models\DemoRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppNotifier
{
    public function sendDemoReservation(DemoRequest $demoRequest): bool
    {
        $token = config('services.whatsapp.token');
        $phoneNumberId = config('services.whatsapp.phone_number_id');
        $recipient = config('services.whatsapp.recipient', '573057149417');

        if (!$token || !$phoneNumberId) {
            $demoRequest->update(['whatsapp_status' => 'not_configured']);
            Log::warning('WhatsApp no está configurado para notificar la demo.', ['demo_request_id' => $demoRequest->id]);
            return false;
        }

        $contact = $demoRequest->contact_data ?? [];
        $scheduledAt = optional($demoRequest->scheduled_at)->timezone(config('app.timezone'))->format('d/m/Y H:i');
        $message = implode("\n", [
            '📅 Nueva reserva de demo Noryvaq',
            'Nombre: '.($contact['first_name'] ?? '').' '.($contact['last_name'] ?? ''),
            'Correo: '.($contact['email'] ?? 'No indicado'),
            'Teléfono: '.($contact['phone'] ?? 'No indicado'),
            'Negocio: '.($demoRequest->business?->name ?? 'No indicado'),
            'Modalidad: '.match ($demoRequest->demo_mode) {
                'guided' => 'Demo guiada',
                'both' => 'Probar ahora + demo guiada',
                default => 'Probar ahora',
            },
            'Fecha y hora: '.($scheduledAt ?: 'No indicada'),
            'Mensaje: '.($demoRequest->attendee_message ?: 'Sin mensaje'),
        ]);

        $response = Http::withToken($token)
            ->acceptJson()
            ->post("https://graph.facebook.com/v20.0/{$phoneNumberId}/messages", [
                'messaging_product' => 'whatsapp',
                'to' => $recipient,
                'type' => 'text',
                'text' => ['preview_url' => false, 'body' => $message],
            ]);

        if ($response->successful()) {
            $demoRequest->update([
                'whatsapp_status' => 'sent',
                'whatsapp_message_id' => $response->json('messages.0.id'),
            ]);
            return true;
        }

        $demoRequest->update(['whatsapp_status' => 'failed']);
        Log::error('No se pudo enviar la notificación de WhatsApp.', [
            'demo_request_id' => $demoRequest->id,
            'status' => $response->status(),
            'response' => $response->json(),
        ]);

        return false;
    }
}
