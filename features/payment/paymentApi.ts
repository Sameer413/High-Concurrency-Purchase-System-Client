import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/baseQuery";
import { generateIdempotencyKey, IdempotencyKeyManager } from "@/lib/idempotency";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    // Create payment order (Step 1)
    createPayment: builder.mutation<
      ApiResponse<{
        paymentId: string;
        razorpayOrderId: string;
        amount: number;
        currency: string;
        razorpayKeyId: string;
        idempotent?: boolean; // Flag indicating if response is cached
      }>,
      {
        orderId: string;
        amount: number;
        currency: string;
        notes?: string;
        userId?: string; // Optional for idempotency key generation
      }
    >({
      query: (body) => {
        // Generate or retrieve idempotency key
        const context = `payment_${body.orderId}`;
        let idempotencyKey = IdempotencyKeyManager.retrieve(context);
        
        if (!idempotencyKey) {
          // Generate new key
          idempotencyKey = body.userId
            ? generateIdempotencyKey(body.userId, body.orderId)
            : generateIdempotencyKey('user', body.orderId);
          
          // Store for potential retries
          IdempotencyKeyManager.store(context, idempotencyKey);
        }

        return {
          url: "/payments/create",
          method: "POST",
          body: {
            orderId: body.orderId,
            amount: body.amount,
            currency: body.currency,
            notes: body.notes,
          },
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
        };
      },
      // Clean up stored key on success
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          // Don't remove key immediately - keep for potential retries
          // It will be cleaned up after 24 hours automatically
        } catch (error) {
          // Keep key for retry
          console.error('Payment creation failed, key preserved for retry');
        }
      },
    }),

    // Verify payment signature (Step 2)
    verifyPayment: builder.mutation<
      ApiResponse<{
        success: boolean;
        orderId: string;
        orderNumber: string;
        paymentId: string;
        status: string;
        paidAt: string;
      }>,
      {
        orderId: string;
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }
    >({
      query: (body) => ({
        url: "/payments/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),

    // Get payment details
    getPayment: builder.query<
      ApiResponse<{
        id: string;
        orderId: string;
        razorpayOrderId: string;
        razorpayPaymentId: string;
        amount: number;
        currency: string;
        status: string;
        createdAt: string;
      }>,
      string
    >({
      query: (paymentId) => ({
        url: `/payments/${paymentId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    // Get order payments
    getOrderPayments: builder.query<
      ApiResponse<
        Array<{
          id: string;
          orderId: string;
          razorpayOrderId: string;
          razorpayPaymentId: string;
          amount: number;
          currency: string;
          status: string;
          createdAt: string;
        }>
      >,
      string
    >({
      query: (orderId) => ({
        url: `/payments/order/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, orderId) => [
        { type: "Payment", id: orderId },
      ],
    }),

    // Handle payment failure
    handlePaymentFailure: builder.mutation<
      ApiResponse<null>,
      {
        orderId: string;
        razorpayOrderId: string;
        reason: string;
      }
    >({
      query: (body) => ({
        url: "/payments/failure",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useVerifyPaymentMutation,
  useGetPaymentQuery,
  useGetOrderPaymentsQuery,
  useHandlePaymentFailureMutation,
} = paymentApi;
