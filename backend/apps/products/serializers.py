from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if not request.user.is_staff:
                validated_data['owner'] = request.user
                validated_data['is_global'] = False
        return super().create(validated_data)
