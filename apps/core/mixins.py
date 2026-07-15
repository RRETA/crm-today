class TenantQuerySetMixin:
    """Filtra el queryset por el tenant del usuario autenticado y fuerza ese
    mismo tenant al crear registros. Toda vista sobre un TenantAwareModel
    debe heredar de este mixin en vez de repetir el filtro."""

    def get_queryset(self):
        return super().get_queryset().filter(tenant=self.request.user.tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)
