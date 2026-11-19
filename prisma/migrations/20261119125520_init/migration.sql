-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'google',
    "token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "template_id" TEXT NOT NULL DEFAULT 'modern-crimson-spotlight',
    "creator_email" TEXT,
    "creator_name" TEXT,
    "creator_phone" TEXT,
    "student_name" TEXT NOT NULL,
    "name_part1" TEXT,
    "name_part2" TEXT,
    "nickname" TEXT,
    "class_name" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "school_year" TEXT NOT NULL DEFAULT '2024 – 2027',
    "sender_name" TEXT,
    "guest_name" TEXT,
    "friend_photo_time" TEXT,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "day_of_week" TEXT,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT,
    "gathering_location" TEXT,
    "shoot_location" TEXT NOT NULL,
    "detailed_address" TEXT,
    "google_maps_url" TEXT,
    "dress_code" TEXT,
    "note" TEXT,
    "invite_message" TEXT,
    "wish_message" TEXT,
    "signature" TEXT,
    "avatar_photo" TEXT,
    "group_photo" TEXT,
    "bg_image" TEXT,
    "gallery" TEXT,
    "timeline" TEXT,
    "wishes" TEXT,
    "stickers" TEXT,
    "components_visible" TEXT,
    "primary_color" TEXT NOT NULL DEFAULT '#890F0D',
    "secondary_color" TEXT DEFAULT '#720000',
    "font_family" TEXT NOT NULL DEFAULT 'Plus Jakarta Sans',
    "font_size" TEXT NOT NULL DEFAULT 'md',
    "text_align" TEXT NOT NULL DEFAULT 'center',
    "views" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvps" (
    "id" TEXT NOT NULL,
    "invitation_id" TEXT NOT NULL,
    "invitation_slug" TEXT,
    "guest_name" TEXT NOT NULL,
    "relation" TEXT DEFAULT 'Bạn thân',
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "phone" TEXT,
    "message" TEXT,
    "virtual_gift" TEXT DEFAULT 'bouquet',
    "companion_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishes" (
    "id" TEXT NOT NULL,
    "invitation_id" TEXT NOT NULL,
    "invitation_slug" TEXT,
    "sender_name" TEXT NOT NULL,
    "relation" TEXT,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "school_class" TEXT NOT NULL,
    "student_count" INTEGER,
    "region" TEXT DEFAULT 'Đà Nẵng',
    "expected_month" TEXT DEFAULT 'Chưa rõ',
    "notes" TEXT,
    "discount_code" TEXT DEFAULT 'GPKY10-XUAN2026',
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_slug_key" ON "invitations"("slug");

-- CreateIndex
CREATE INDEX "invitations_slug_idx" ON "invitations"("slug");

-- CreateIndex
CREATE INDEX "invitations_creator_email_idx" ON "invitations"("creator_email");

-- CreateIndex
CREATE INDEX "rsvps_invitation_id_idx" ON "rsvps"("invitation_id");

-- CreateIndex
CREATE INDEX "rsvps_invitation_slug_idx" ON "rsvps"("invitation_slug");

-- CreateIndex
CREATE INDEX "wishes_invitation_id_idx" ON "wishes"("invitation_id");

-- CreateIndex
CREATE INDEX "wishes_invitation_slug_idx" ON "wishes"("invitation_slug");

-- CreateIndex
CREATE INDEX "otp_codes_email_otp_is_used_idx" ON "otp_codes"("email", "otp", "is_used");

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishes" ADD CONSTRAINT "wishes_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
